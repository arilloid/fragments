// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
// const { error } = require('console');

const validateDate = (dateString) => {
  if (!dateString) return true;
  if (!isNaN(Date.parse(dateString))) return false;
};

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) throw new Error('ownerId is required');
    if (!type) throw new Error('type is required');
    if (!validateDate(created) || !validateDate(updated))
      throw new Error('the passed date string is invalid');
    if (!Fragment.isSupportedType(type)) throw new Error(`the type: ${type} is not supported`);
    if (typeof size != 'number' || size < 0) throw new Error('size must be a number > 0');

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
    this.created = created || new Date().toISOString();
    this.updated = updated || this.created;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    if (!ownerId) {
      throw new Error('Owner ID is missing!');
    } else
      try {
        return await listFragments(ownerId, expand);
      } catch (error) {
        logger.error('Failed to retrieve the fragments associated with the user');
        throw error;
      }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    if (!ownerId || !id) {
      throw new Error('Owner Id / Fragment id - missing!');
    } else
      try {
        const fragment = await readFragment(ownerId, id);
        if (!fragment) {
          logger.error('Failed to find fragment with the same owner and id');
          throw new Error('Fragment not found');
        }
        return fragment;
      } catch (error) {
        logger.error('Failed to retrieve the fragment');
        throw error;
      }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    if (!ownerId || !id) {
      throw new Error('Owner Id / Fragment id - missing!');
    } else
      try {
        await deleteFragment(ownerId, id);
        logger.info(`Fragment ${this.id} deleted successfully`);
      } catch (error) {
        logger.error('Failed to delete fragment with the same owner and id:', ownerId, id, error);
        throw error;
      }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    try {
      this.updated = new Date().toISOString();
      await writeFragment(this);
      logger.info(`Fragment ${this.id} saved successfully`);
    } catch (error) {
      logger.error(`Failed to save fragment ${this.id}:`, error);
      throw error;
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    try {
      const data = await readFragmentData(this.ownerId, this.id);
      if (!data) {
        logger.error("Failed to find fragment's data with the same owner and id");
        throw new Error('Fragment Data not found');
      }
      return data;
    } catch (error) {
      logger.error("Failed to retrieve fragment's data");
      throw error;
    }
  }

  /**
   * Sets the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error('No data passed!');
    }
    try {
      this.size = Buffer.from(data).length;
      this.updated = new Date().toISOString();
      await writeFragmentData(this.ownerId, this.id, data);
      logger.info(`${this.id} - Fragment's data saved successfully`);
    } catch (error) {
      logger.error(`${this.id}  - Failed to save fragment's data:`, error);
      throw error;
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // Only plain text is supported for now
    if (this.isText) {
      const validFormats = ['text/plain', 'text/plain; charset=utf-8'];
      return validFormats.filter((type) => type !== this.type);
    }
    return [];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = ['text/plain', 'text/plain; charset=utf-8'];
    return validTypes.includes(value);
  }
}

module.exports.Fragment = Fragment;

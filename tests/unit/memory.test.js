// Importing the source functions
const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/index');

describe('Memory - database related calls', () => {
  const ownerId = 'testOwner';
  const fragmentId = 'testFragment';
  const testData = Buffer.from('test text');
  const testFragment = { ownerId: ownerId, id: fragmentId, type: 'text/plain', size: testData.length };

  describe('writeFragment() and readFragment()', () => {
    test('writeFragment() puts metadata into the db and readFragment() returns placed metadata', async () => {
      await writeFragment(testFragment);
      const fragment = await readFragment(ownerId, fragmentId);
      expect(fragment).toEqual(testFragment);
    });
  
    test('readFragment returns undefined when unable to find value', async () => {
      const result = await readFragment('wrongOwner', 'wrongId');
      expect(result).toBeUndefined();
    });

    test('writeFragment() expects a fragment', async () => {
      await expect(async () => await writeFragment()).rejects.toThrow();
    });
  
    test('readFragment() expect ownerId and fragment id', async () => {
      await expect(async () => await readFragment()).rejects.toThrow();
      await expect(async () => await readFragment(ownerId)).rejects.toThrow();
    });
  });

  describe('writeFragmentData() and readFragmentData()', () => { 
    test('writeFragmentData() puts data into the db and readFragment() returns placed data', async () => {
      await writeFragmentData(ownerId, fragmentId, testData);
      const data = await readFragmentData(ownerId, fragmentId);
      expect(data).toEqual(testData);
    });
  
    test('readFragmentData returns undefined when unable to find value', async () => {
      const result = await readFragmentData('wrongOwner', 'wrongId');
      expect(result).toBeUndefined();
    });

    test('readFragmentData() expects ownerId and fragment id', async () => {
      await expect(async () => await readFragmentData()).rejects.toThrow();
      await expect(async () => await readFragmentData(ownerId)).rejects.toThrow();
    });
  
    test('writeFragmentData() expects ownerId and fragment id', async () => {
      await expect(async () => await writeFragmentData()).rejects.toThrow();
      await expect(async () => await writeFragmentData(ownerId)).rejects.toThrow();
    });
  });

  describe('listFragments()', () => {
    test('listFragments() returns correct id', async () => {
      await writeFragment(testFragment);
      const fragmentIds = await listFragments(ownerId);
      expect(fragmentIds).toContain(fragmentId);
    });
  
    test('listFragments() returns an empty array', async () => {
      await writeFragment(testFragment);
      const fragmentIds = await listFragments('wrongOwner');
      expect(Array.isArray(fragmentIds)).toBe(true);
      expect(fragmentIds).toEqual([]);
    });

    test('listFragments() expects ownerId', async () => {
      await expect(async () => await listFragments()).rejects.toThrow();
    });
  });

  describe('listFragments()', () => {
    test("deleteFragment() removes both: fragment's metadata and data", async () => {
      await writeFragment(testFragment);
      await writeFragmentData(ownerId, fragmentId, testData);
      await deleteFragment(ownerId, fragmentId);
      const fragment = await readFragment(ownerId, fragmentId);
      const data = await readFragmentData(ownerId, fragmentId);
      expect(fragment).toBeUndefined();
      expect(data).toBeUndefined();
    }); 

    test('deleteFragment() expects ownerId and fragment id', async () => {
      await expect(async () => await deleteFragment()).rejects.toThrow();
      await expect(async () => await deleteFragment(ownerId)).rejects.toThrow();
    });

    test('deleteFragment() throws an error when unable to find a fragment to delete', async () => {
      await expect(async () => await deleteFragment('wrongOwner', 'wrongId')).rejects.toThrow();
    });
  });  
});

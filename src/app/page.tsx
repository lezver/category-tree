'use client';

import { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { FaFolderPlus } from 'react-icons/fa6';
import { TiPlus } from 'react-icons/ti';
import { FaMinus } from 'react-icons/fa';

type CategoryType = {
  id: number;
  name: string;
  parentId: null | number;
  collapsed: boolean;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [counter, setCounter] = useState<number>(1);

  const addCategory = (parentId: null | number = null): void => {
    const newCategory: CategoryType = {
      id: counter,
      name: 'New Category',
      parentId,
      collapsed: false,
    };

    setCategories([...categories, newCategory]);

    setCounter(counter + 1);
  };

  const renameCategory = (id: number, newValue: string): void =>
    setCategories(
      categories.map(cat => (cat.id === id ? { ...cat, name: newValue } : cat))
    );

  const toggleCollapse = (id: number): void =>
    setCategories(
      categories.map(cat =>
        cat.id === id ? { ...cat, collapsed: !cat.collapsed } : cat
      )
    );

  const removeCategory = (id: number): void => {
    const deleteRecursive = (catId: number): void => {
      categories
        .filter(cat => cat.parentId === catId)
        .forEach(child => deleteRecursive(child.id));

      setCategories(prevCategories =>
        prevCategories.filter(cat => cat.id !== catId)
      );
    };

    deleteRecursive(id);

    categories.length && setCounter(1);
  };

  const renderCategories = (parentId: null | number = null) =>
    categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => (
        <div
          key={cat.id}
          className={`${
            parentId ? 'mx-5' : 'mx-0'
          } p-3 rounded-xl border-dashed border-l-4 border-l-lime-300`}
        >
          <div className="p-1 rounded-md bg-lime-100 flex gap-x-3 w-fit ali">
            <button
              onClick={() => toggleCollapse(cat.id)}
              className="flex items-center gap-x-1 hover:opacity-75 active:scale-95 active:opacity-100 transition-all"
            >
              {cat.collapsed ? (
                <TiPlus size={40} color="teal" />
              ) : (
                <FaMinus size={40} color="fuchsia" />
              )}
            </button>
            <input
              className="bg-lime-700 outline-none border-transparent rounded-lg px-5 w-40"
              type="text"
              value={cat.name}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                renameCategory(cat.id, target.value)
              }
            />
            <div className="flex flex-row-reverse justify gap-x-3">
              <button
                onClick={() => addCategory(cat.id)}
                className="flex items-center gap-x-1 hover:opacity-75 active:scale-95 active:opacity-100 transition-all"
                type="button"
              >
                <FaFolderPlus color="brown" size={30} />
              </button>
              <button
                onClick={() => {
                  removeCategory(cat.id);
                }}
                className="flex items-center gap-x-1 hover:opacity-75 active:scale-95 active:opacity-100 transition-all"
                type="button"
              >
                <MdDeleteForever color="red" size={30} />
              </button>
            </div>
          </div>
          {!cat.collapsed && renderCategories(cat.id)}
        </div>
      ));

  console.log(categories);

  return (
    <div className="mx-auto w-[1000px] p-10 flex flex-col items-start gap-y-6">
      <button
        type="button"
        className="bg-amber-800 p-3 rounded-lg font-bold hover:opacity-85 active:scale-95 active:opacity-100 transition-all mx-auto"
        onClick={() => addCategory()}
      >
        {categories.length ? 'Add another Category?' : 'Create a Category'}
      </button>
      {renderCategories()}
    </div>
  );
}

import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center "
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">
                    <LuChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </span>
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;

import { useState, useRef, useEffect } from 'react';
import './comboBox.css'

const ComboBox = ({ options, placeholder = 'Search...' }) => {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef(null);
    const listboxRef = useRef(null);
    const comboboxId = useRef(`combobox-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        if (inputValue.trim() === '') {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        }

        setHighlightedIndex(-1);
    }, [inputValue, options]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const selectOption = (option) => {
        setInputValue(option);
        setIsOpen(false);
        inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen && e.key === 'ArrowDown') {
            setIsOpen(true);
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prevIndex => {
                    const newIndex = prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0;
                    scrollOptionIntoView(newIndex);
                    return newIndex;
                });
                break;

            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prevIndex => {
                    const newIndex = prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1;
                    scrollOptionIntoView(newIndex);
                    return newIndex;
                });
                break;

            case 'Enter':
                if (isOpen && highlightedIndex >= 0) {
                    e.preventDefault();
                    selectOption(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;

            default:
                break;
        }
    };

    const scrollOptionIntoView = (index) => {
        if (listboxRef.current && index >= 0) {
            const optionElement = listboxRef.current.children[index];
            if (optionElement) {
                optionElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = (e) => {
        setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    const handleOptionHover = (index) => {
        setHighlightedIndex(index);
    };

    return (
        <div className="combobox-container">
            <label id={`${comboboxId.current}-label`} htmlFor={comboboxId.current}>
                Search
            </label>

            <div className="combobox-wrapper">
                <input
                    ref={inputRef}
                    id={comboboxId.current}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    aria-controls={`${comboboxId.current}-listbox`}
                    aria-activedescendant={
                        highlightedIndex >= 0
                            ? `${comboboxId.current}-option-${highlightedIndex}`
                            : undefined
                    }
                    aria-labelledby={`${comboboxId.current}-label`}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="combobox-input"
                />

                {isOpen && (
                    <ul
                        ref={listboxRef}
                        id={`${comboboxId.current}-listbox`}
                        role="listbox"
                        className={`combobox-listbox ${isOpen ? 'open' : ''}`}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    id={`${comboboxId.current}-option-${index}`}
                                    role="option"
                                    aria-selected={highlightedIndex === index}
                                    onClick={() => selectOption(option)}
                                    onMouseEnter={() => handleOptionHover(index)}
                                    className={`combobox-option ${highlightedIndex === index ? 'highlighted' : ''}`}
                                >
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className="combobox-no-results">No results found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ComboBox;
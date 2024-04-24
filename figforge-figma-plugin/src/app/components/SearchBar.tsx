import React from 'react';

import './styles.css';

import SearchIcon from '../assets/icons/search.svg';

type SearchBarProps = {
  onSearch: () => void;
  placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  onSearch;

  return (
    <div className="search-bar">
      {/* <form action=""> */}
      <img src={SearchIcon} alt="search icon" />
      <input type="text" placeholder={placeholder} />
      {/*  </form> */}
    </div>
  );
}

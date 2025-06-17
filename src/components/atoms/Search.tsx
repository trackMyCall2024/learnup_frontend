import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@mui/joy';

interface SearchProps {
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({ inputValue, setInputValue }: SearchProps) => (
    <Input
        startDecorator={<FontAwesomeIcon icon={faSearch} />}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search"
    />
);

export default Search;

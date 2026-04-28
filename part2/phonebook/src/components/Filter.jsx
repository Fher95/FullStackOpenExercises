const Filter = ({ filterValue, handleFilterValue }) => {
    return (<>
        <div>
            filter shown with <input value={filterValue} onChange={handleFilterValue} />
        </div>
    </>)
}

export default Filter;
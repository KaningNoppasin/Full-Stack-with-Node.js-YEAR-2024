import { useEffect, useState } from "react";

function Hello(){
    const [name, setName] = useState("kob");

    const changeName = () => {
        setName("Top");
    }

    const [product, setProduct] = useState(['java', 'php', 'c#', 'react', 'node.js']);

    const showName = () => {
        console.log(name);
    }

    const [value, setValue] = useState('100');

    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log("start");
    }, [items]);
    // * => when items Change useEffect will call

    const newItem = () => {
        setItems([1, 3, 5, 7, 9]);
    }

    return (
        <>
            <div>Hello {name}</div>
            <button onClick={changeName}>Click Here</button>

            {product.map((item) =>
                <>
                    {/* <div>Name is</div> */}
                    <div>Name is {item}</div>
                </>
            )}

            {product.length > 0 ? <div>Have</div> : <div>Not Have</div>}

            <input onChange={(e) => {setName(e.target.value)}} />
            <button onClick={showName}>Show Name</button>


            <select onChange={(e) => setValue(e.target.value)}>
                <option value="100">Java</option>
                <option value="200">PHP</option>
                <option value="300">Node.js</option>
            </select>
            <div>{value}</div>

            <input type="checkbox" onClick={(e) => setValue(e.target.checked)} />Agree
            {value ? <div>Checked</div> : <div>unChecked</div>}

            <div>useEffect Example</div>
            <button onClick={newItem}>
                Add Item
            </button>

            <div style={{ backgroundColor: 'red', color: 'white', padding: '20px'}}>Hello</div>


        </>
    )
}

export default Hello;
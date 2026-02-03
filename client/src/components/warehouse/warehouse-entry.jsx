const WarehouseEntry = ({id, name, location, maxCapacity, inventory, onUpdate, onDelete}) => {

    const handleUpdate = () => {
        onUpdate(id);
    }

    const handleDelete = () => {
        onDelete(id);
    }

    const handleUpdateItem = () => {
        
    }

    const handleDeleteItem = () => {

    }

    return (
        <>
            <span>
                <p>{name}</p>
                <p>{location}</p>
                <p>Max Capacity: {maxCapacity}</p>
            </span>
            <span>
                {/** This update button is for managing warehouse details but not inventory */}
                <button onClick={handleUpdate}>Update Warehouse Details</button>
                <button onClick={handleDelete}>Delete Warehouse</button>
            </span>
            <div>
                {inventory.map((itemEntry) => (
                    <ItemSubEntry
                        key={itemEntry['_id']}
                        quantity={itemEntry['quantity']}
                        section={itemEntry['section']}
                        item={itemEntry['item']}
                    />
                ))}
            </div>
        </>
    );
}

const ItemSubEntry = ({quantity, section, item}) => {


    return(
        <> 
            <p>Item Name: {item.name}</p>
            <div>
                <p>Quantity: {quantity}</p>
                <p>Section: {section}</p>
                <p>Item SKU: {item.sku}</p>
            </div>
            <p>Item Description: {item.description}</p>
        </>
    )
}

export default WarehouseEntry;
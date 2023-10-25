import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import EditModal from './component/EditModal';
import Stack from '@mui/material/Stack';
import './App.css';

const fetchProducts = async (currentPage, pageSize, setProducts) => {
  try {
    const response = await fetch(`https://localhost:7287/api/Product?page=${currentPage}&pageSize=${pageSize}`);
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error('Error fetching data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const App = () => {   
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchProducts(currentPage, pageSize, setProducts);
  }, [currentPage, pageSize]);

  const handleEditClick = (product) => {
    setName(product.name);
    setLastName(product.lastName);
    setEditingProductId(product.id);
    setIsEditModalOpen(true);
  };
  const handleAddClick = () => {
    setName('');
    setLastName('');
    setEditingProductId(null);
    setIsNew(true);
    setIsEditModalOpen(true);
  };
  
  const handleSaveNewClick = async () => {
    // Check if both name and lastName are not empty
    if (!name.trim() || !lastName.trim()) {
      console.error ('Name and Last Name are required.');
      return;
    }
    try {
      const response = await fetch(`https://localhost:7287/api/Product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastName }),
      });
  
      if (response.ok) {
        setCurrentPage(1);  //Set the current page to 1 before fetching the data
        fetchProducts(1,pageSize, setProducts); //Fetch data for the first page
        setName('');
        setLastName('');
        setIsEditModalOpen(false);
      } else {
        console.error('Error adding new product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding new product:', error);
    }
  };
  
  const handleSaveEditClick = async () => {
    try {
      const response = await fetch(`https://localhost:7287/api/Product/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastName }),
      });


      if (response.ok) {
        fetchProducts(currentPage, pageSize, setProducts);
        setEditingProductId(null);
        setName('');
        setLastName('');
        setIsEditModalOpen(false);
      } else {
        console.error('Error editing product:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      const response = await fetch(`https://localhost:7287/api/Product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) { 
        fetchProducts(currentPage, pageSize, setProducts);
      } else {
        console.error('Error deleting product:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  const renderTableRows = () => {
    if (!Array.isArray(products.products)) {
      return <tr><td colSpan="4">Loading....</td></tr>;
    }
    if (products.products.length === 0) {
      return <tr><td colSpan="4">No data available</td></tr>;
    }
    return products.products.map(product => (
      <tr key={product.id}>
       
        <td>{product.name}</td>
        <td>{product.lastName}</td>
        <td>
          {editingProductId === product.id ? (
            <div>
            </div>
          ):(
          <div>
              <button className={`action-button edit-button`} onClick={() => handleEditClick(product)}>Edit</button>
             <button className={`action-button delete-button`} onClick={() => handleDeleteClick(product.id)}>Delete</button>
            </div>
          )}
        </td> 
      </tr>
    ));
  };


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };  


  const totalPages = Math.ceil(products.totalCount / pageSize);

  return (
  
    
    <div className='container'>
      <div className='table-container'>
        <h1>Product Table</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
    <button className="action-button add-button" onClick={handleAddClick}>Add New Product😎</button>
  </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">NAME</th>
              <th scope="col">LAST NAME</th>
              <th scope="col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
      <div className='pagination'>
        <label htmlFor="pageSize">Item Per Page:  </label>
        <select
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          value={pageSize}
          className="select-element"
        >  
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <Stack spacing={2}>  
          <Pagination
            count={totalPages}
            page={currentPage}
            shape="rounded"
            variant="outlined"
            onChange={handlePageChange} 
            style={{ backgroundColor: '#c2ffb9', borderColor: 'black' }}
          />
        </Stack>
      </div>
      <div className='total-info'>
        Total Count: {products.totalCount}<br />
        Total Pages: {totalPages}
      </div>
      <EditModal
  isOpen={isEditModalOpen}
  onClose={() => {
    setIsEditModalOpen(false);
    setName(''); 
    setLastName(''); 
    setIsNew(false); 
  }}
  onSave={handleSaveEditClick}
  onSaveNew={handleSaveNewClick}
  name={name}
  setName={setName}
  lastName={lastName}
  setLastName={setLastName}
  isNew={isNew}
/>  
    </div> 
  );
}

export default App;

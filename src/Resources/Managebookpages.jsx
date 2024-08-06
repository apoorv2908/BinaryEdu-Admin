import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../Access/config';
import Topbar from '../Dashboard/Topbar';
import synclogo from "./Assets/synclogo.png"
import "./Styles/managebookpages.css"
import { decodeId } from '../Access/Encodedecode';

const Managebookpages = () => {
  const { book_id } = useParams();
  const decodedId = decodeId(book_id); // Decode the ID for internal use
  const [bookPages, setBookPages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortOption, setSortOption] = useState('page_number_asc');

  const [editInputs, setEditInputs] = useState({});

  useEffect(() => {
    fetchBookPages();
  }, [searchQuery, page, limit, book_id, sortOption]);

  const fetchBookPages = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Resources/fetchbookpages.php?search=${searchQuery}&page=${page}&limit=${limit}&book_id=${decodedId}&sort=${sortOption}`);
      const data = await response.json();
      if (data.success) {
        setBookPages(data.bookPages);
        setTotal(data.total);
      } else {
        alert('Failed to fetch book pages');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching book pages');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleNewPageNumberChange = (pageId, value) => {
    setEditInputs((prevInputs) => ({
      ...prevInputs,
      [pageId]: value,
    }));
  };

  const savePageNumber = async (pageId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Resources/updatePageNumber.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_id: pageId,
          new_page_number: editInputs[pageId],
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Page number updated successfully');
        fetchBookPages();
      } else {
        alert('Failed to update page number');
      }
    } catch (error) {
      console.error('Error updating page number:', error);
      alert('Error updating page number');
    }
  };

  const getSNo = (index) => {
    return (page - 1) * limit + index + 1;
  };

  const firstEntry = (page - 1) * limit + 1;
  const lastEntry = Math.min(page * limit, total);

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <Topbar />
          <div className="col-md-12">
            <div className="container mt-3 bg-white shadow-lg p-3 mb-5 bg-white rounded">
              <div className="row d-flex justify-content-end align-items-center">
                <div className='text-grey fw-bold'>Manage Book Pages</div>
                <div className="col-md-2 d-flex justify-content-between">
                  <select className="form-control" value={sortOption} onChange={handleSortChange}>
                    <option value="">--Sort--</option>
                    <option value="page_number_asc">Page Number (Asc)</option>
                    <option value="page_number_desc">Page Number (Desc)</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by page title"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <hr></hr>
              <div className="row mt-3">
                <div className="col-md-12">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">SNo</th>
                        <th scope="col">Page Title</th>
                        <th scope="col">Page Number</th>
                        <th scope="col">Chapter Name</th>
                        <th scope="col">Book Name</th>
                        <th scope="col">Image</th>

                      </tr>
                    </thead>
                    <tbody>
                      {bookPages.map((item, index) => (
                        <tr key={item.page_id} className={index % 2 === 0 ? 'table-hover' : ''}>
                          <td>{getSNo(index)}</td>
                          <td>{item.page_title}</td>
                          <td className= 'd-flex'>
                            <input
                              type="number"
                              className="form-control small-input"
                              value={editInputs[item.page_id] || item.page_number}
                              onChange={(e) => handleNewPageNumberChange(item.page_id, e.target.value)}
                            />
                            <img src= {synclogo} onClick={() => savePageNumber(item.page_id)} className= 'synclogo cursor mx-2 mt-1'></img>                          </td>
                          <td>{item.chapter_name}</td>
                          <td>{item.book_name}</td>
                          <td>
                            {item.image_path && (
                              <img src={`${config.apiBaseUrl}/fullmarks-server/uploads/book_pages/${item.image_path}`} alt="Resource" style={{ width: '50px', height: '50px'}} />
                            )}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookPages.length === 0 && <p>No book pages found.</p>}
                  <div className='d-flex justify-content-between'>
                    <div>
                      Showing <b>{firstEntry}</b> to <b>{lastEntry}</b> of <b>{total}</b> total entries
                    </div>
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: Math.ceil(total / limit) }, (_, index) => (
                          <li key={index + 1} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${page === Math.ceil(total / limit) ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managebookpages;

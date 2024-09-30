import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../Dashboard/Topbar';
import config from '../../Access/config';
import { encodeId } from '../../Access/Encodedecode';

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10); // Entries per page
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchChapters();
  }, [searchQuery, page, limit, sortOption]);

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Chapters/fetchchapters.php?search=${searchQuery}&page=${page}&limit=${limit}&sortOption=${sortOption}`);
      const data = await response.json();
      if (data.success) {
        setChapters(data.chapters);
        setTotal(data.total);
      } else {
        alert('Failed to fetch chapters');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching chapters');
    }
  };

  const handleDelete = async (chapter_id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Chapters/deletechapters.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_id }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Chapter deleted successfully');
        fetchChapters(); // Refresh the chapter list
      } else {
        alert('Failed to delete chapter');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting chapter');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page on new search
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to the first page on limit change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1); // Reset to the first page on sort change
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
          {/* Sidebar */}
          <Topbar />
          {/* Main content */}
          <div className="col-md-12">
            <div className="container mt-3 bg-white shadow-lg p-3 mb-5 bg-white rounded">
              {/* Topbar */}
              <div className="row">
                <div className="col-md-12 d-flex justify-content-between">
                <div className='text-grey h5'>Manage Chapters</div>
                  <Link to={'/addchapters'}><button className="btn btn-primary">+ Add Chapter</button></Link>
                </div>
              </div>
              <hr />
              <div className="row d-flex justify-content-end">
                <div className="col-md-2 ">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              {/* Table */}
              <div className="row mt-3">
                <div className="col-md-12 table-responsive">
                  <table className="table table-sm  table-bordered table-rounded">
                    <thead className= 'table-light'>
                      <tr>
                        <th scope="col">S.no.</th>
                        <th scope="col">Chapter Name</th>
                        <th scope="col">Book Name</th>
                        <th scope="col">Class Name/ Subject Name/ Series Name</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chapters.map((item, index) => (
                        <tr key={item.chapter_id} className={index % 2 === 0 ? ' table-hover' : ''}>
                          <td>{index+1}</td>
                          <td>{item.chapter_title}</td>
                          <td>{item.book_name}</td>
                          <td className= 'comb'>{item.class_name} / {item.subject_name} / {item.series_name}</td>
                          <td>
                            <Link to={`/updatechapter/${encodeId(item.chapter_id)}`}>
                              <button className="btn btn-sm btn-info mr-2 mx-3">
                                Edit
                              </button>
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.chapter_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {chapters.length === 0 && <p>No chapters found.</p>}
                  
                </div>
              </div >
              {/* Pagination */}
              <div className="row ">
              
                <div className="col-md-12 d-flex justify-content-between ">
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
  );
};

export default Chapters;

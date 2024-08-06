import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Topbar from '../Dashboard/Topbar';
import config from '../Access/config';

const Updatebookpage = () => {
  const { book_id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({ pageTitle: '', chapterName: '', image: null });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, [book_id])

  const fetchPageData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Resources/fetchpagedetails.php?book_id=${book_id}`);
      const data = await response.json();
      if (data.success) {
        setPageData({ pageTitle: data.bookPage.page_title, chapterName: data.bookPage.chapter_name, image: data.bookPage.image_path, pageNumber: data.bookPage.page_number  });
      } else {
        alert('Failed to fetch page data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching page data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('book_id', book_id);
    formData.append('pageTitle', pageData.pageTitle);
    formData.append('chapterName', pageData.chapterName);
    formData.append('page_number', pageData.pageNumber);

    if (pageData.image) {
      formData.append('image', pageData.image);
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Resources/updatebookpage.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Page updated successfully');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/managebookpages');
        }, 2000); // Show pop-up for 2 seconds before navigating
      } else {
        alert('Failed to update page');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating page');
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <Topbar />
          <div className="col-md-12">
            <div className="container mt-3">
              <div className="row">
                <div className="col-md-12 bg-white shadow-lg p-3 mb-5 bg-white rounded">
                <div className='text-grey h6'>Update Book Page</div>
                <hr></hr>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="pageTitle" className='mb-2'><b>Page Title</b></label>
                      <input
                        type="text"
                        className="custom-input cursor"
                        id="pageTitle"
                        name="pageTitle"
                        value={pageData.pageTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <br></br>
                    <div className="form-group">
                      <label htmlFor="pageNumber" className='mb-2'><b>Page Number</b></label>
                      <input
                        type="text"
                        className="custom-input cursor"
                        id="pageNumber"
                        name="pageNumber"
                        value={pageData.pageNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <br />
                    <div className="form-group">
                      <label htmlFor="chapterName" className='mb-2'><b>Chapter Name</b></label>
                      <input
                        type="text"
                        className="custom-input cursor"
                        id="chapterName"
                        name="chapterName"
                        value={pageData.chapterName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <br />
                    <div className="form-group">
  <label htmlFor="image" className='mb-2'><b>Upload Image</b></label>
  {pageData.image ? (
    <div className="d-flex align-items-center">
      {typeof pageData.image === 'object' && (
        <img src={`http://localhost/fullmarks-server/uploads/${pageData.image}`} alt="Loaded Image" className="mr-2" style={{ width: '100px' }} />
      )}
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setPageData({ ...pageData, image: null })}>Cancel</button>
    </div>
  ) : (
    <input
      type="file"
      className="cursor"
      id="image"
      name="image"
      accept=".png, .jpg, .jpeg"
      onChange={(e) => setPageData({ ...pageData, image: e.target.files[0] })}
    />
  )}
</div>

                    <br />
                    <div className='d-flex justify-content-end'>
                      <button type="submit" className="btn btn-primary d-flex">Update Page</button>
                    </div>
                  </form>
                  {showPopup && (
                    <div className="popup">
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pop-up CSS */}
      <style jsx>{`
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #f0f0f0;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default Updatebookpage;

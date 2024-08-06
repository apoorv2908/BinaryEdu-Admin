import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Dashboard/Topbar';
import config from '../Access/config';
import "./Styles/Addlibrary.css";

const Addlibrary = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [series, setSeries] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [thumbImage, setThumbImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [lessonPlanLink, setLessonPlanLink] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Classes/fetchclasses.php`);
      const data = await response.json();
      if (data.success) {
        setClasses(data.classes);
      } else {
        alert('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching classes');
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Subjects/fetchsubjects.php?class_id=${classId}`);
      const data = await response.json();
      if (data.success) {
        setSubjects(data.subjects);
        setSeries([]);
        setBooks([]);
        setChapters([]);
        setSelectedSubject('');
        setSelectedSeries('');
        setSelectedBook('');
        setSelectedChapter('');
      } else {
        alert('Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching subjects');
    }
  };

  const fetchSeries = async (classId, subjectId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Book/fetchseriesforbooks.php?class_id=${classId}&subject_id=${subjectId}`);
      const data = await response.json();
      if (data.success) {
        setSeries(data.series);
        setBooks([]);
        setChapters([]);
        setSelectedSeries('');
        setSelectedBook('');
        setSelectedChapter('');
      } else {
        alert('Failed to fetch series');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching series');
    }
  };

  const fetchBooks = async (classId, subjectId, seriesId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Book/fetchbookforsection.php?class_id=${classId}&subject_id=${subjectId}&series_id=${seriesId}`);
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
        setChapters([]);
        setSelectedBook('');
        setSelectedChapter('');
      } else {
        alert('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching books');
    }
  };

  const fetchChapters = async (classId, subjectId, seriesId, bookId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Chapters/fetchchapters.php?class_id=${classId}&subject_id=${subjectId}&series_id=${seriesId}&book_id=${bookId}`);
      const data = await response.json();
      if (data.success) {
        setChapters(data.chapters);
        setSelectedChapter('');
      } else {
        alert('Failed to fetch chapters');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching chapters');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('selectedClass', selectedClass);
    formData.append('selectedSubject', selectedSubject);
    formData.append('selectedSeries', selectedSeries);
    formData.append('selectedBook', selectedBook);
    formData.append('resourceTitle', resourceTitle);
    formData.append('selectedChapter', selectedChapter); // Include the selected chapter
    formData.append('resourceType', resourceType);
    
    if (resourceType === 'videos') {
      formData.append('videoFile', videoFile);
      formData.append('videoLink', videoLink);
    } else if (resourceType === 'documents' || resourceType === 'lessonplans') {
      formData.append('documentFile', documentFile);
      formData.append('thumbImage', thumbImage);
      formData.append('documentLink', documentLink);
      formData.append('lessonPlanLink', lessonPlanLink);
    } else if (resourceType === 'audio') {
      formData.append('audioFile', audioFile);
      formData.append('audioLink', audioLink);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Resources/Library/addlibrary.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Library resource added successfully');
        navigate('/library');
      } else {
        alert('Failed to add library resource');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding library resource');
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <Topbar />
          {/* Main content */}
          <div className="col-md-12">
            <div className="container mt-3">
              {/* Topbar */}
              <div className="row">
                <div className="col-md-12 bg-white shadow-lg p-3 mb-5 bg-white rounded">
                  <div className='text-grey h6'>Add Library Resource</div>
                  <hr></hr>
                  <form onSubmit={handleSubmit}>
                    <label className='fw-bold'>Class</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={selectedClass}
                      required
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        fetchSubjects(e.target.value);
                      }}
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
                      ))}
                    </select><br /><br></br>
                    <label className='fw-bold'>Subject</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={selectedSubject}
                      required
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        fetchSeries(selectedClass, e.target.value);
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub) => (
                        <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                      ))}
                    </select><br /><br></br>
                    <label className='fw-bold'>Series</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={selectedSeries}
                      required
                      onChange={(e) => {
                        setSelectedSeries(e.target.value);
                        fetchBooks(selectedClass, selectedSubject, e.target.value);
                      }}
                    >
                      <option value="">Select Series</option>
                      {series.map((ser) => (
                        <option key={ser.series_id} value={ser.series_id}>{ser.series_name}</option>
                      ))}
                    </select><br /><br></br>
                    <label className='fw-bold'>Book</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={selectedBook}
                      required
                      onChange={(e) => {
                        setSelectedBook(e.target.value);
                        fetchChapters(selectedClass, selectedSubject, selectedSeries, e.target.value);
                      }}
                    >
                      <option value="">Select Book</option>
                      {books.map((book) => (
                        <option key={book.book_id} value={book.book_id}>{book.book_name}</option>
                      ))}
                    </select><br /><br></br>
                    <label className='fw-bold'>Chapter</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={selectedChapter}
                      required
                      onChange={(e) => setSelectedChapter(e.target.value)}
                    >
                      <option value="">Select Chapter</option>
                      {chapters.map((chap) => (
                        <option key={chap.chapter_id} value={chap.chapter_id}>{chap.chapter_title}</option>
                      ))}
                    </select><br /><br></br>
                    <label className='fw-bold'>Resource Title</label><br />
                    <input
                      className='custom-input mt-3'
                      type="text"
                      value={resourceTitle}
                      required
                      onChange={(e) => setResourceTitle(e.target.value)}
                    /><br /><br></br>
                    <label className='fw-bold'>Resource Type</label><br />
                    <select
                      className='custom-input mt-3 cursor'
                      value={resourceType}
                      required
                      onChange={(e) => setResourceType(e.target.value)}
                    >
                      <option value="">Select Resource Type</option>
                      <option value="videos">Videos</option>
                      <option value="documents">Documents</option>
                      <option value="lessonplans">Lesson Plans</option>
                      <option value="audio">Audio</option>
                    </select><br /><br></br>
                    {resourceType === 'videos' && (
                      <>
                        <label className='fw-bold'>Video File</label><br />
                        <input
                          className=' mt-3'
                          type="file"
                          onChange={(e) => setVideoFile(e.target.files[0])}
                        /><br /><br></br>
                        <div className= 'd-flex justify-content-center fw-bold'>OR</div>
                        <label className='fw-bold'>Enter Video Link</label><br />
                        <input
                          className='custom-input mt-3'
                          type="text"
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                        /><br /><br></br>
                      </>
                    )}
                    {(resourceType === 'documents' || resourceType === 'lessonplans') && (
                      <>
                        <label className='fw-bold'>Document File</label><br />
                        <input
                          className=' mt-3'
                          type="file"
                          onChange={(e) => setDocumentFile(e.target.files[0])}
                        /><br /><br></br>
                                                <div className= 'd-flex justify-content-center fw-bold'>OR</div>

                        <label className='fw-bold'>Enter Document Link</label><br />
                        <input
                          className='custom-input mt-3'
                          type="text"
                          value={documentLink}
                          onChange={(e) => setDocumentLink(e.target.value)}
                        /><br /><br></br>
                      </>
                    )}
                    {resourceType === 'audio' && (
                      <>
                        <label className='fw-bold'>Audio File</label><br />
                        <input
                          className=' mt-3'
                          type="file"
                          onChange={(e) => setAudioFile(e.target.files[0])}
                        /><br /><br></br>
                                                <div className= 'd-flex justify-content-center fw-bold'>OR</div>

                        <label className='fw-bold'>Enter Audio Link</label><br />
                        <input
                          className='custom-input mt-3'
                          type="text"
                          value={audioLink}
                          onChange={(e) => setAudioLink(e.target.value)}
                        /><br /><br></br>
                      </>
                    )}
                    <button className="btn btn-primary" type="submit">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* End of main content */}
        </div>
      </div>
    </div>
  );
};

export default Addlibrary;

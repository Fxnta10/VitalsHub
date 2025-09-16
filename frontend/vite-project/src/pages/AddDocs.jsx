import React, { useState,useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { set } from 'mongoose';


export default function AddDocs() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  useEffect(()=>{
    const fetchDocs = async()=>{
      try {
        const res = await axiosInstance.get("/user/getDocs");
        setFiles(res.data);
      } catch (error) {
        console.log("Error in fetching docs",error.message);
        toast.error("Error in fetching docs");
      }
    }
    fetchDocs();
  },[])
  const { isAddingDoc, addDocs } = useAuthStore();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/user/deleteDoc/${id}`);
      if(res.data.success){
        setFiles(files.filter(file => file._id !== id));
        toast.success("Document deleted successfully");
      }
    } catch (error) {
     console.log("Error in deleting doc",error.message);
     toast.error("Error in deleting doc");
      
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      return toast.error("All fields are required");
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const result = await addDocs(formData);
    if (result?.success) {
      setTitle("");
      setFile(null);
      document.getElementById("docFile").value = null;
    }
    const res = await axiosInstance.get("/user/getDocs");
    
      setFiles(res.data);
  }

  return (
    <div className="container py-5" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
  <h2 className="fw-bold mb-3" style={{ color: "#2d3748" }}>My Documents</h2>
  <p className="text-muted mb-4">Manage your medical documents with ease and security.</p>

  {/* Upload Box */}
  <div className="border border-2 border-dashed rounded-4 p-5 text-center mb-5" style={{ borderColor: "#cbd5e0" }}>
    <div className="mb-3">
      <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center mx-auto" style={{ width: 80, height: 80 }}>
        <i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
      </div>
    </div>
    <p className="fw-semibold mb-1">Drag and drop files here</p>
    <p className="text-muted" style={{ fontSize: "0.9rem" }}>or click to browse</p>
    <form onSubmit={handleSubmit} className="mt-3">
      <input
        type="text"
        id="docTitle"
        className="form-control mb-3 rounded-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Title"
        required
        style={{ background: "#f6f8fb" }}
      />
      <input
        type="file"
        id="docFile"
        className="form-control mb-3 rounded-3"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        required
        style={{ background: "#f6f8fb" }}
      />
      <button
        type="submit"
        className="btn btn-primary fw-bold px-4 py-2 rounded-3"
        disabled={isAddingDoc}
      >
        {isAddingDoc ? "Uploading..." : "Upload Document"}
      </button>
    </form>
  </div>

  {/* Uploaded Documents */}
  <h4 className="fw-bold mb-3">Uploaded Documents</h4>
  {files.length > 0 ? (
    <div className="table-responsive">
      <table className="table align-middle border rounded-3 overflow-hidden shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Document Name</th>
            <th>Upload Date</th>
            <th>File Type</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td className="fw-semibold">{file.title}</td>
              <td>{new Date(file.createdAt).toLocaleDateString()}</td>
              <td>{file.pdf?.contentType?.includes("pdf") ? "PDF" : "Image"}</td>
              <td className="text-center">
                <a
                  href={`http://localhost:5002/api/user/pdf/${file._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  View
                </a>
                <a
                  href={`http://localhost:5002/api/user/pdf/${file._id}`}
                  download
                  className="btn btn-sm btn-outline-secondary me-2"
                >
                  Download
                </a>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(file._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-muted">No files uploaded yet</div>
  )}
</div>

  )
}

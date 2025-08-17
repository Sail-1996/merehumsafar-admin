

import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import useCareerStore from "../Context/CareerContext";
import { useNavigate } from 'react-router-dom';

const Career = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 5;

  const navigate = useNavigate();

  const {
    careersPosts,
    getAllCareer,
    getJobApplicants,
    jobApplicants,
    removeCareerPost,
  } = useCareerStore();

  useEffect(() => {
    getAllCareer();
  }, []);

  const scrollJobs = (direction) => {
    const container = document.getElementById("jobs-container");
    const scrollAmount = 300;

    if (container) {
      const newScroll =
        direction === "left"
          ? Math.max(0, container.scrollLeft - scrollAmount)
          : container.scrollLeft + scrollAmount;

      container.scrollTo({ left: newScroll, behavior: "smooth" });
      setScrollPosition(newScroll);
    }
  };

  const handleDelete = (id) => {
    removeCareerPost(id);
  };

  const handleEditPost = (job) => {

    console.log("Editing job:", job); // Log to verify data
    navigate('/career/add', { 
      state: { 
        post: {
          ...job,
          // Ensure image data is properly structured for the form
          image: job.imageDetails?.imageUrl || job.image,
          imageId: job.imageDetails?.imageId || job.imageId
        } 
      } 
    });
  };

  // Sort applicants
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  // Filter and sort applicants
  const filteredApplicants = jobApplicants?.filter(applicant => {
    return (
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.phone.includes(searchTerm) ||
      applicant.id.toString().includes(searchTerm)
    );
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = sortedApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(sortedApplicants.length / applicantsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className=" dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        

        {/* Job Openings Section (unchanged from your original code) */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Current Openings
            </h3>
            
          </div>

          <div
            id="jobs-container"
            className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {careersPosts.map((job) => (
              <div
                key={job?.jobPostId}
                className={`flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                  selectedRole === job.jobPostId
                    ? "ring-2 ring-blue-500"
                    : "hover:shadow-lg"
                }`}
                onClick={() => {
                  setSelectedRole(job.jobPostId);
                  getJobApplicants(job.jobPostId);
                  setCurrentPage(1); // Reset to first page when changing jobs
                }}
              >
                {/* Fix image display by checking for imageDetails */}
                {(job?.imageDetails?.imageUrl || job?.image) && (
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={job?.imageDetails?.imageUrl || job?.image}
                      alt={job?.jobTitle}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2 right-3 flex gap-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(job);
                        }}
                        className="p-1 bg-white/80 text-blue-500 rounded-full hover:bg-white transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.jobPostId);
                        }}
                        className="p-1 bg-white/80 text-red-500 rounded-full hover:bg-white transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {job?.jobTitle}
                    </h3>
                  </div>
                  <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        job?.isActive === true
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {job?.isActive === true ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center py-2 rounded-lg">
                    {job?.totalApplicants > 1 ? job?.totalApplicants + " Applicants" : job?.totalApplicants + " Applicant"}
                  </div>
                  
                  {/* Add edit/delete buttons for jobs without images */}
                  {!(job?.imageDetails?.imageUrl || job?.image) && (
                    <div className="flex justify-end mt-3 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(job);
                        }}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.jobPostId);
                        }}
                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedRole && jobApplicants && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="md:text-xl text-base font-semibold text-gray-800 dark:text-white">
                  Candidates for{" "}
                  {
                    careersPosts.find((job) => job.jobPostId === selectedRole)
                      ?.jobTitle
                  }
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({filteredApplicants.length} applicants)
                  </span>
                </h3>
                <div className="flex items-center space-x-4">
                  
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('id')}
                      >
                        <div className="flex items-center">
                          Application ID
                          {getSortIcon('id')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('name')}
                      >
                        <div className="flex items-center">
                          Name
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('phone')}
                      >
                        <div className="flex items-center">
                          Contact
                          {getSortIcon('phone')}
                        </div>
                      </th>
                      {/* <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </th> */}
                      
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Resume
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentApplicants.length > 0 ? (
                      currentApplicants.map((candidate) => (
                        <tr key={candidate?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {candidate?.jobCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {candidate?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {candidate?.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {candidate?.phone}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                candidate?.status === "new"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : candidate?.status === "reviewed"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                                  : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              }`}
                            >
                              {candidate.status}
                            </span>
                          </td> */}
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <a
                                href={candidate?.resume}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download Resume"
                              >
                                <FaFilePdf size={20} />
                              </a>
                             
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No applicants yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">{indexOfFirstApplicant + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastApplicant, filteredApplicants.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredApplicants.length}</span> applicants
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;

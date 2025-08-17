import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const useCareerStore = create((set, get) => ({
  careersPosts: [],
  jobApplicants: [],
  ploadedFiles: [], 

  getAllCareer: async () => {
    try {
      const res = await axiosInstance.get('job-posts');
      
      // Ensure each job post has properly structured image data
      const formattedPosts = res.data.map(post => ({
        ...post,
        // If the post has imageDetails, keep it; otherwise, create a compatible structure
        imageDetails: post.imageDetails || (post.image ? {
          imageId: post.imageId || null,
          imageUrl: post.image
        } : null)
      }));
      
      set({ careersPosts: formattedPosts });
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
    }
  },



  createJobPost: async (job) => {
    try {
      const res = await axiosInstance.post('/job-posts', job);
      
      // Add the new job post to the state with proper image structure
      set((state) => ({
        careersPosts: [...state.careersPosts, {
          ...res.data,
          // Ensure image data is properly structured
          imageDetails: job.imageId ? {
            imageId: job.imageId,
            imageUrl: res.data.image || ''
          } : null
        }],
      }));
      
      return res.data;
    } catch (error) {
      console.error("Failed to add jobpost:", error);
      throw error;
    }
  },

  editJobPost: async (job, id) => {
    try {
      const res = await axiosInstance.put(`/job-posts/${id}`, job);
      
      // Update the job post in the state
      set((state) => ({
        careersPosts: state.careersPosts.map(post => 
          post.jobPostId === id ? {
            ...res.data,
            // Ensure image data is properly structured
            imageDetails: job.imageId ? {
              imageId: job.imageId,
              imageUrl: res.data.image || ''
            } : null
          } : post
        ),
      }));
      
      return res.data;
    } catch (error) {
      console.error("Failed to edit jobpost:", error);
      throw error;
    }
  },



  getJobApplicants: async (id) => {
    try {
      const res = await axiosInstance.get(`/job-applicants/job-post/${id}`);
     
      
      set({ 
       
        jobApplicants: res.data, // Main categories only
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },



  removeCareerPost: async (id) => {
    try {
     const res = await axiosInstance.delete(`/job-posts/${id}`);

     if(res.status === 204){
      alert("Job Post Deleted")
     }
      set((state) => ({
        careersPosts: state.careersPosts.filter((job) => job.jobPostId !== id),
       
      }));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  },


 
}));

export default useCareerStore;

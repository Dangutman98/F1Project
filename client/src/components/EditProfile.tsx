import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    profilePhoto: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        profilePhoto: user.profile.profilePhoto || ''
      });
    }
    return () => {
      // Cleanup camera stream when component unmounts
      if (stream) {
        stopCamera();
      }
    };
  }, [user]);

  const compressImage = (base64String: string, maxWidth: number = 800, maxHeight: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Further increase compression by reducing quality to 0.3 (30%)
        resolve(canvas.toDataURL('image/jpeg', 0.3));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64String;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('User not found');
      }

      // If no photo is selected, just return without making the API call
      if (!formData.profilePhoto) {
        navigate('/profile');
        return;
      }

      // Ensure the photo is properly formatted
      let photoData = formData.profilePhoto;
      
      // If it's already a complete data URL, extract just the base64 data
      if (photoData.startsWith('data:image')) {
        photoData = photoData.split(',')[1];
      }

      console.log('Sending photo to server...');

      const response = await fetch(`http://localhost:5066/api/user/${user.id}/profile-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profilePhoto: photoData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Server response:', errorData);
        throw new Error(errorData?.message || 'Failed to update profile photo');
      }

      const data = await response.json();
      
      // Update the user context with the new photo
      // Ensure we have the complete data URL format
      const completePhotoData = photoData.startsWith('data:image') ? 
        photoData : 
        `data:image/jpeg;base64,${photoData}`;

      updateProfile({
        ...user.profile,
        profilePhoto: completePhotoData
      });
      
      console.log('Profile photo updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please choose an image under 5MB.');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, or WebP).');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const compressedBase64 = await compressImage(base64String);
          const base64Data = compressedBase64.split(',')[1];
          
          setFormData(prev => ({
            ...prev,
            profilePhoto: base64Data
          }));
        };
        reader.onerror = () => {
          setError('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error processing image. Please try again.');
        console.error('Image processing error:', err);
      }
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => {
          if (track.readyState === 'live') {
            console.log('Stopping track:', track.kind);
            track.stop();
          }
        });
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setShowCamera(false);
    } catch (err) {
      console.error('Error stopping camera:', err);
    }
  };

  const startCamera = async () => {
    try {
      // If camera is already running, don't start it again
      if (stream && stream.active) {
        console.log('Camera is already running');
        return;
      }

      // First ensure any existing streams are stopped
      stopCamera();

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      console.log('Camera access granted');

      // Set the stream first
      setStream(mediaStream);
      setShowCamera(true);

      // Wait a bit for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      // Set up video element
      videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current?.play();
          console.log('Video element playing');
        } catch (err) {
          console.error('Error playing video:', err);
          stopCamera();
        }
      };

    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access was denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else {
          setError(`Error accessing camera: ${err.message}`);
        }
      } else {
        setError('Error accessing camera. Please make sure you have granted camera permissions.');
      }
      // Ensure cleanup on error
      stopCamera();
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setError('Camera not ready. Please try again.');
      return;
    }

    try {
      console.log('Starting photo capture...');
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      context.drawImage(videoRef.current, 0, 0);
      console.log('Photo captured, dimensions:', canvas.width, 'x', canvas.height);
      
      // Get the complete data URL
      const base64String = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Converting to base64...');
      
      // Compress the image
      const compressedBase64 = await compressImage(base64String);
      
      setFormData(prev => ({
        ...prev,
        profilePhoto: compressedBase64
      }));
      
      console.log('Photo processed and set in form data');
      
      // Stop the camera after successful capture
      stopCamera();
    } catch (err) {
      console.error('Error processing captured image:', err);
      setError('Error processing captured image. Please try again.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Edit Profile</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo {!formData.profilePhoto && <span className="text-gray-500">(Optional)</span>}
                </label>
                <div className="mt-1 flex flex-col items-center space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {formData.profilePhoto ? (
                      <img
                        src={formData.profilePhoto.startsWith('data:image') ? formData.profilePhoto : `data:image/jpeg;base64,${formData.profilePhoto}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-2xl">+</span>
                        <span className="text-xs mt-1">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                    >
                      Take Photo
                    </button>
                  </div>
                </div>

                {showCamera && (
                  <div className="mt-4 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-md mx-auto rounded-lg"
                      style={{ transform: 'scaleX(-1)' }} // Mirror the camera view
                    />
                    <div className="mt-2 flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-green-600 text-black rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
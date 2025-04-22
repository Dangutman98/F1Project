import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AnimalEmojiSelector from './AnimalEmojiSelector';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    profilePhoto: '',
    favoriteAnimal: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        profilePhoto: user.profile.profilePhoto || '',
        favoriteAnimal: user.profile.favoriteAnimal || ''
      });
    }

    // Cleanup camera stream when component unmounts
    return () => {
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

      // Update profile photo if one is selected
      if (formData.profilePhoto) {
        let photoData = formData.profilePhoto;
        
        // If it's already a complete data URL, extract just the base64 data
        if (photoData.startsWith('data:image')) {
          photoData = photoData.split(',')[1];
        }

        const photoResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${user.id}/profile-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            profilePhoto: photoData
          })
        });

        if (!photoResponse.ok) {
          const errorData = await photoResponse.json().catch(() => ({ message: 'Unknown error occurred' }));
          console.error('Server response:', errorData);
          throw new Error(errorData?.message || 'Failed to update profile photo');
        }
      }

      // Update favorite animal if changed
      if (formData.favoriteAnimal !== user.profile?.favoriteAnimal) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${user.id}/favorite-animal`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favoriteAnimal: formData.favoriteAnimal
        })
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
          throw new Error(errorData?.message || 'Failed to update favorite animal');
        }
      }

      // Update the user context with all changes
      const completePhotoData = formData.profilePhoto ? (
        formData.profilePhoto.startsWith('data:image') ? 
          formData.profilePhoto : 
          `data:image/jpeg;base64,${formData.profilePhoto}`
      ) : user.profile?.profilePhoto;

      updateProfile({
        ...user.profile,
        profilePhoto: completePhotoData,
        favoriteAnimal: formData.favoriteAnimal || user.profile?.favoriteAnimal
      });
      
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
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => {
          if (track.readyState === 'live') {
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
        return;
      }

      // First ensure any existing streams are stopped
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });

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
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      context.drawImage(videoRef.current, 0, 0);
      
      // Get the complete data URL
      const base64String = canvas.toDataURL('image/jpeg', 0.8);
      
      // Compress the image
      const compressedBase64 = await compressImage(base64String);
      
      setFormData(prev => ({
        ...prev,
        profilePhoto: compressedBase64
      }));
            
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 py-2 px-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-bold text-center mb-3 text-gray-900 dark:text-white">Edit Profile</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Photo {!formData.profilePhoto && <span className="text-gray-500">(Optional)</span>}
                </label>
                <div className="mt-1 flex flex-col items-center space-y-2">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {formData.profilePhoto ? (
                      <img
                        src={formData.profilePhoto.startsWith('http') ? formData.profilePhoto : 
                            formData.profilePhoto.startsWith('data:image') ? formData.profilePhoto :
                            `data:image/jpeg;base64,${formData.profilePhoto}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={() => {
                          console.error('Error loading profile photo');
                          setFormData(prev => ({ ...prev, profilePhoto: '' }));
                        }}
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
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors border border-gray-300 shadow-sm hover:shadow"
                    >
                      Take Photo
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">*Click on photo to add from device</p>
                </div>

                {showCamera && (
                  <div className="mt-2 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-md mx-auto rounded-lg"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="mt-2 flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors border border-gray-300 shadow-sm hover:shadow"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors border border-gray-300 shadow-sm hover:shadow"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <AnimalEmojiSelector
                  selectedAnimal={formData.favoriteAnimal || ''}
                  onSelect={(animal) => setFormData(prev => ({ ...prev, favoriteAnimal: animal }))}
                />
              </div>

              {/* Action Buttons - Inside card */}
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-row justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-2 px-3 rounded-md text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors border border-gray-300 dark:border-transparent shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 dark:bg-red-600 dark:hover:bg-red-700 text-gray-900 dark:text-white py-2 px-3 rounded-md text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors border border-gray-300 dark:border-transparent shadow-sm hover:shadow"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
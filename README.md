# F1 Project

## Assets Setup

This project uses Git LFS (Large File Storage) to manage assets like images. To properly clone and work with this repository, follow these steps:

1. Install Git LFS:
   - Windows: Download and install from https://git-lfs.com
   - Mac: `brew install git-lfs`
   - Linux: `sudo apt-get install git-lfs`

2. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd [repository-name]
   ```

3. Set up Git LFS:
   ```bash
   git lfs install
   ```

4. Pull the assets:
   ```bash
   git lfs pull
   ```

The assets are located in the following directories:
- `client/src/assets/TeamsIcons/` - Team logos and icons
- `client/src/assets/events-pics/` - Event images
- `client/src/assets/racing-spots/` - Racing spot images

Note: Make sure you have Git LFS installed before cloning the repository to ensure all assets are downloaded correctly. 
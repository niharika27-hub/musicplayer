# Audio Files# Audio Files



## Music Streaming via APIPlace your MP3 files here with the exact names listed below. The player will automatically load and play them when you click the corresponding card.



This Catifyy music player uses the **Deezer API** for streaming music, so you don't need to download or store audio files locally.## Required Audio Files:



### How it works:### Trending Songs:

- When you click a song, the app searches for it on Deezer's database- `diewithasmile.mp3` - Die with a Smile by Lady Gaga

- It plays a 30-second preview (free tier)- `gul.mp3` - Gul by Anuv Jain

- No audio files need to be stored in this folder- `alagasman.mp3` - Alag Asman by Anuv Jain

- Works on any deployment platform (GitHub, Vercel, Netlify, etc.)- `forareason.mp3` - For a Reason by Karan Aujla



### Benefits:### Albums:

✅ No large files to download or store  - `forareason.mp3` - P-POP CULTURE by Karan Aujla

✅ Works on free hosting platforms  - `jotum.mp3` - JO Tum Mere Ho by Anuv Jain

✅ Instant access to millions of songs  - `mismatched.mp3` - Mismatched by Anurag Saikia

✅ Always up-to-date music catalog  - `yjhd.mp3` - Yeh Jawaani hai Deewani by Pritam

✅ No copyright issues with file storage  

## How to Add Songs:

### For Local Testing (Optional):

If you want to test with local audio files on your computer, you can place MP3 files here with these naming conventions:### Option 1: Copy from Downloads (Windows bash)

```bash

```# Example: copy a file from Downloads and rename it

audio/cp "/c/Users/yourname/Downloads/Die with a Smile.mp3" ./audio/diewithasmile.mp3

  ├── gul.mp3cp "/c/Users/yourname/Downloads/Gul.mp3" ./audio/gul.mp3

  ├── alagasman.mp3```

  ├── kesariya.mp3

  └── [song-title].mp3### Option 2: Drag and Drop (Windows Explorer)

```1. Open this `audio` folder in Windows Explorer

2. Drag your MP3 files into this folder

**Note:** Local audio files are ignored by git and won't be deployed. The app will automatically fall back to API streaming in production.3. Rename them to match the exact names listed above



### API Information:## Testing:

- **Service:** Deezer API

- **Cost:** Free (no API key required)After adding the files, serve the project:

- **Preview Length:** 30 seconds per song```bash

- **Rate Limit:** Generous for personal projectspython -m http.server 8000

```

Need full-length songs? Consider upgrading to a paid music API service like Spotify API with authentication.

Then open: http://localhost:8000/index.html

Click any card - if the audio file exists, it will play! If not, a simulated player will run (no actual audio).

## Notes:
- File names are case-insensitive on Windows but keep them lowercase for consistency
- Supported formats: .mp3, .m4a, .wav
- The player script checks `data-src` first, then falls back to filename matching

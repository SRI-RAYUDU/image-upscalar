const form = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const scaleSelect = document.getElementById('scaleSelect');
const loader = document.getElementById('loader'); // your old loader, can be removed or kept
const bootstrapLoader = document.getElementById('bootstrapLoader');
const outputImages = document.getElementById('outputImages');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!imageInput.files.length) {
    alert('Please select an image file');
    return;
  }

  bootstrapLoader.style.display = 'inline-block';
  loader.style.display = 'none';
  outputImages.innerHTML = '';

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('scale', scaleSelect.value);

  const startTime = Date.now(); 

  try {
    const response = await fetch('http://localhost:5000/upscale', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to upscale image');
    }

    const data = await response.json();

  
    const elapsed = Date.now() - startTime;
    const delay = 2000; 

    if (elapsed < delay) {

      await new Promise((res) => setTimeout(res, delay - elapsed));
    }

    bootstrapLoader.style.display = 'none';

    outputImages.innerHTML = `
      <div class="image-box">
        <h3>Original Image</h3>
        <img src="${data.original}" alt="Original Image" />
      </div>
      <div class="image-box">
        <h3>Upscaled Image</h3>
        <img src="${data.upscaled}" alt="Upscaled Image" />
        <a href="${data.upscaled}" download="upscaled.jpg" class="download-btn">Download</a>
      </div>
    `;
  } catch (error) {
    bootstrapLoader.style.display = 'none';
    alert(error.message);
  }
});

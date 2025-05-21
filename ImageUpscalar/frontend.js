let selectedFile = null;

document.getElementById('imageInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    selectedFile = file;
    document.getElementById('outputImages').innerHTML = '';
  } else {
    alert("Please upload a JPEG or PNG image.");
  }
});

function upscaleImage() {
  const scale = document.getElementById('scaleSelect').value;
  const loader = document.getElementById('loader');
  const output = document.getElementById('outputImages');

  if (!selectedFile) {
    alert("Please upload an image first.");
    return;
  }

  loader.style.display = "block";
  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("scale", scale);

fetch("http://localhost:3000/upscale", {
  method: "POST",
  body: formData
})


  .then(res => res.json())
  .then(data => {
    loader.style.display = "none";
    output.innerHTML = `
      <div class="image-box">
        <h3>Original</h3>
        <img src="${data.original}" />
      </div>
      <div class="image-box">
        <h3>Upscaled (${scale}x)</h3>
        <img src="${data.upscaled}" />
      </div>
    `;
  })
  .catch(err => {
    loader.style.display = "none";
    alert("Upscaling failed!");
    console.error(err);
  });
}

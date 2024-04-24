figma.showUI(__html__, { width: 460, height: 680 });

let dynamicComponents = false

function containsButton(str) {
  return str.toLowerCase().includes('button');
}

function constainsInput(str){
  return str.toLowerCase().includes('inputbox');
}

async function uploadToCloudinary(imageName, imageHash, imageBytes) {
  console.log("Upload to Cloudinary is Called: ")
  let imageUrl = '';

  // Make a POST request to Cloudinary
  await fetch('https://api.cloudinary.com/v1_1/dmjmb3c3q/image/upload', {
    method: 'POST',
    body: imageBytes,
    headers: {
      'Content-Type': 'image/jpeg', // Adjust the Content-Type header as needed
      'Authorization': 'Bearer 264133676873735' // Replace with your Cloudinary API key
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Image uploaded successfully:', data);
    imageUrl = data.secure_url;
    console.log("Cloudinary is returning: ", imageUrl);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  console.log("Cloudinary is returning: ", imageUrl)
  return imageUrl;
}





// Frame Data
async function getFrameData(frame){
  const css_styles = await frame.getCSSAsync()

  if (containsButton(frame.name) || constainsInput(frame.name)){
    dynamicComponents=true;
  }

  const frameInfo = {
    type:frame.type || null,
    name: frame.name  || null,
    width: frame.width  || null,
    height: frame.height  || null,
    id:frame.id  || null,
    layoutGrids: frame.layoutGrids  || null,
    children:[],
    css:css_styles || null,
    parent:frame.parent  || null,
    images: [],
  };

  // Handling images within the frame
  // if(frame.fills.length>0){ 
  //   let paint = frame.fills[0]
  //   if (paint.type === 'IMAGE') {
  //     const image = figma.getImageByHash(paint.imageHash)
  //     const bytes = await image.getBytesAsync()
  //     const cloudinaryUrl = ""
  //     frameInfo.images.push({
  //       imageID:frame.name,
  //       imageHash:paint.imageHash,
  //       imageUrl:cloudinaryUrl,
  //     }); 
  //   }
  // }

  for (const key in frame) {
    if (frame.hasOwnProperty(key)) {
      frameInfo[key] = frame[key] !== figma.mixed ? frame[key] : null;
    }
  }
  if(frame.children){
    for (const childId of frame.children.map(child => child.id)) {
      const child = figma.getNodeById(childId);
      if (child) {
        const childFrameInfo = await getFrameData(child);
        frameInfo.children.push(childFrameInfo);
      }
    }
  }
  return frameInfo;
}

// Frame Selection
async function getSelectedFrameInfo() {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'FRAME') {
    const selectedFrame = selection[0];
    const frameInfo = await getFrameData(selectedFrame)
    const externalFrameData={
      externalProperty:"Random Value"
    }
    const obj = {
      frameData:frameInfo,
      externalData:externalFrameData,
      dynamicComponents:dynamicComponents
    }
    const msg = JSON.parse(JSON.stringify(obj));

    console.log('Sending through MSG Frame Node:', obj);
    try{
      figma.ui.postMessage({ type: 'selectedFrameInfo', data: msg });
    }catch(error){
      console.error('Error sending message:', error);
    }
  } else {
    console.log("None Selected")
  }
}

figma.on('selectionchange', () => {
  getSelectedFrameInfo();
});

// store something in local storage
async function storeData(key, value) {
  const data = JSON.stringify(value);
  await figma.clientStorage.setAsync(key, data);
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'setData') {
    storeData(msg.key, msg.value);
  }
};

// get something from local storage
async function getData(key) {
  const data = await figma.clientStorage.getAsync(key);
  if (!data) return null;
  return JSON.parse(data);
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'getData') {
    getData(msg.key).then((data) => {
      figma.ui.postMessage({ type: 'getData', value: data });
    });
  }
};

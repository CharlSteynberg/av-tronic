"use strict";

/*
    This is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Set up audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

/**
 * Retrieves audio from an external source, the initializes the drawing function
 * @param {String} url the url of the audio we'd like to fetch
 */
const drawAudio = (url,cnv,pad=20,smp=70,cbf=null) => {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) =>
    {
        let chanlA = audioBuffer.getChannelData(0);
        // let chanlB = audioBuffer.getChannelData(1);
        let factor = Math.ceil( chanlA.length / smp );
        let number = 0,  sample, detail, result = [];

        for ( number = 0;  number < chanlA.length;  number += factor  )
        {
            detail = undefined;
            sample = 0;

            for ( detail of chanlA.slice( number, (number+factor) ) )
            { sample += detail };

            // for ( detail of chanlB.slice( number, (number+factor) ) )
            // { sample += detail };

            // sample = ( (sample < 0) ? (sample * -1) : sample );
            sample = ((sample / (factor*2)) * 100 );
            sample = ( (sample > 1) ? 1 : ((sample < -1) ? -1 : sample) );

            result.push( sample );
        };

        draw( result, cnv, pad, cbf );

        // chanlA.map(( detail )=>
        // {
        //     if ( detail < 0 )
        //     { number++ };
        // });
        //
        // dump( chanlA.length, number );

        // dump( audioBuffer.getChannelData(0) );
        // dump( filterData(audioBuffer,smp) );
        // draw( normalizeData(filterData(audioBuffer,smp)), cnv, pad);
    });
};

/*
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */
const filterData = (audioBuffer,smp=70) => {
  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  const samples = smp; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  return filteredData;
};

/**
 * Normalizes the audio data to make a cleaner illustration
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

/**
 * Draws the audio file into a canvas element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 * @returns {Array} a normalized array of data
 */
const draw = (normalizedData,cnv,pad=20,cbf=null) => {
  // set up the canvas
  const canvas = cnv;
  const dpr = window.devicePixelRatio || 1;
  const padding = pad;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

  // draw the line segments
  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i;
    let height = normalizedData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
        height = 0;
    } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }


  if ( (typeof cbf) === "function" )
  {

      cbf( canvas.toDataURL() );
      ctx.clearRect( 0, 0, canvas.width, canvas.height );
  };
};

/**
 * A utility function for drawing our line segments
 * @param {AudioContext} ctx the audio context
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 1; // how thick the line is
  ctx.strokeStyle = "#fff"; // what color our line is
  ctx.beginPath();
  height = isEven ? height : -height;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};


module.exports = drawAudio;

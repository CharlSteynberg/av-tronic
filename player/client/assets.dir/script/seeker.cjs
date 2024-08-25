

// readme :: info : front-end - this file runs client-side
// ----------------------------------------------------------------------------------------------------------------------------
    "use strict";
// ----------------------------------------------------------------------------------------------------------------------------




// define :: WaveForm : ?
// ----------------------------------------------------------------------------------------------------------------------------
    class WaveForm extends EventTarget
    {
        constructor ( source, canvas=null, gather=1000, height=100 )
        {
            super();

            canvas = ( canvas || document.createElement("canvas") );
            canvas.width = gather;
            canvas.height = height;

            Object.assign( this, { canvas, gather, source } );


            this.listen
            ({
                starts ( signal )
                {
                    if ( this.halted || signal.defaultPrevented )
                    { return };

                    fetch( this.source ).then(result => result.arrayBuffer()).then((buffer)=>
                    {
                        this.buffer = buffer;
                        this.signal("decode");
                    })
                },


                decode ( signal )
                {
                    if ( this.halted || signal.defaultPrevented )
                    { return };

                    (new AudioContext()).decodeAudioData( this.buffer ).then(( buffer )=>
                    {
                        this.buffer = buffer;
                        this.signal("filter");
                    });
                },


                filter ( signal )
                {
                    if ( !this.halted && !signal.defaultPrevented )
                    { this.filter() };
                },


                render ( signal )
                {
                    if ( !this.halted && !signal.defaultPrevented )
                    { this.render() };
                },
            });


            this.signal( "starts" );
        }



        cancel ( vacuum=true )
        {
            this.halted = true;

            if ( vacuum )
            { this.buffer = null };
        }



        filter ()
        {
            let chanl0 = this.buffer.getChannelData(0);
            let chanl1 = ( (this.buffer.numberOfChannels > 1) ? this.buffer.getChannelData(1) : [...chanl0] );
            let length = chanl0.length,  number, subnum;
            let select = ( (length <= this.gather) ? 1 : Math.ceil(length / this.gather) );
            let limits = 0,  deadAt,  slice0,  slice1,  sample,  silent;

            this.buffer = []; // empty buffer .. to be used for samples

            for ( number = 0;  number < length;  number += select  )
            {
                if ( this.halted )
                { return };

                slice0 = chanl0.slice( number, (number+select) );
                slice1 = chanl1.slice( number, (number+select) );
                sample = [0,0];

                for ( subnum = 0;  subnum < slice0.length;  subnum++  )
                {
                    if ( this.halted )
                    { return };

                    sample[0] += ( slice0[subnum] / select );
                    sample[1] += ( slice1[subnum] / select );

                    silent = ( (sample[0] + sample[1]) === 0 );

                    if ( !silent )
                    { deadAt = undefined };

                    if ( !deadAt && silent )
                    { deadAt = ((number+subnum) / length) }; // how far we are in the song here is silent
                };

                sample[0] = ( (sample[0] > 0) ? (sample[0] * -1) : sample[0] );
                sample[1] = ( (sample[1] < 0) ? (sample[1] * -1) : sample[1] );

                this.buffer.push( sample );

                limits = ( (sample[0] > limits) ? sample[0] : ((sample[1] > limits) ? sample[1] : limits) );
                slice0 = undefined; // free memory
                slice1 = undefined; // free memory
            };


            chanl0 = undefined; // free memory
            chanl1 = undefined; // free memory

            this.deadAt = deadAt;
            this.limits = limits;
            this.signal( "render" );
        }



        render ()
        {
            if ( this.halted )
            { return };

            let canvas = this.canvas;
            let contxt = canvas.getContext("2d");
            let buffer = this.buffer;
            let length = buffer.length;
            let dRatio = ( window.devicePixelRatio || 1 );
            let spread = ( canvas.offsetWidth / length );
            let height = canvas.offsetHeight,  limits = this.limits;
            let number,  xx,  y0, y1;

            // contxt.scale( (dRatio / (canvas.offsetWidth / 1000)), dRatio );  // to check out
            // canvas.width = 1000; // ? .. we need to crop it to 1000px

            contxt.scale( dRatio, dRatio );
            contxt.translate( 0, (height / 2) ); // Y-axis 0 = vertical middle
            contxt.lineWidth = 1;
            contxt.strokeStyle = "#fff";
            contxt.beginPath();


            for ( number = 0;  number < length;  number++ )
            {
                if ( this.halted )
                { return };

                xx = Math.trunc( number * spread );
                y0 = ( height * (buffer[number][0] / limits) );
                y1 = ( height * (buffer[number][1] / limits) );

                contxt.moveTo( xx, y0 );
                contxt.lineTo( xx, y1 );
            };


            contxt.stroke();
            this.output = new Image();
            this.output.src = canvas.toDataURL();
            contxt.clearRect( 0, 0, canvas.width, canvas.height );


            if ( this.halted )
            { return };

            this.signal( "finish" );
        }
    }



    module.exports = WaveForm;
// ----------------------------------------------------------------------------------------------------------------------------

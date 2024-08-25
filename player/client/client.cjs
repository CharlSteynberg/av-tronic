

// readme :: info : front-end - this file runs client-side
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------





// import :: tools
// ----------------------------------------------------------------------------------------------------------------------------
    require( "../global/shared.cjs" );

    Modify( globalThis ).define( { WaveForm: require("./assets.dir/script/seeker.cjs") } );
// ----------------------------------------------------------------------------------------------------------------------------





// define :: Signal
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Signal: class Signal extends CustomEvent
        {
            constructor( anonym, detail=null, config=null )
            {
                config = ( config || {name:anonym, bubbles:true, cancelable:true, detail} );
                super( anonym, config );
            }


            static cancel ( signal, degree=3 )
            {
                if ( !signal || !degree )
                { return };

                let relate = ("preventDefault stopPropagation stopImmediatePropagation").split(" ").map(( invoke, number )=>
                {
                    number += 1;

                    if ( number <= degree )
                    { signal[invoke]() };
                });

                return signal;
            }
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------





// evolve :: EventTarget.prototype : relax .. this won't hurt .. much
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( EventTarget.prototype ).define
    ({
        listen ( intake )
        {
            if ( !intake || ((typeof intake) !== "object") )
            { return dump("invalid intake") };

            let callee;
            intake = Object.assign( {}, intake );

            Object.keys( intake ).map(( action )=>
            {
                callee = intake[ action ];
                delete intake[ action ];

                this.addEventListener( action, callee.bind(this) );
            });

            return this;
        },



        signal ( intake, detail=null )
        {
            if ( (typeof intake) === "string" )
            { intake = {[intake]:detail} };

            let entity = ( this.entity || this );

            Object.keys( intake ).map(( aspect )=>
            {
                entity.dispatchEvent( (new Signal( aspect, intake[aspect] )) );
            });

            return this;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// evolve :: HTMLElement.prototype : relax .. this won't hurt .. much
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( HTMLElement.prototype ).define
    ({
        append ( intake )
        {
            let relate = ( intake || 0 ).constructor.name; // string


            switch ( true )
            {
                case ( relate === "Array" ) : break;
                case ( relate === "NodeList" ) : intake = [ ...intake ];  break;
                case ( relate.startsWith("HTML") ) : intake = [ intake ];  break;
                default : dump( "invalid intake" );  return this;
            };


            intake.map(( entity )=>
            {
                relate = ( entity || 0 ).constructor.name;

                if ( !relate.startsWith("HTML") )
                { entity = Create( "span", {}, (entity+"") )  };

                this.appendChild( entity );
            });


            return this;
        },



        assign ( intake )
        {
            if ( !intake || ((typeof intake) !== "object") )
            { return dump("invalid intake") };

            Object.keys( intake ).map(( aspect )=>
            {
                this[ aspect ] = intake[ aspect ];
            });

            return this;
        },



        aspect ( intake )
        {
            let detect = ( typeof intake );
            let detail;

            if ( detect === "string" )
            {
                detail = this.getAttribute( intake );
                return ( (detail==="") ? true : (detail||undefined) );
            };

            if ( !intake || (detect !== "object") )
            { return dump("invalid intake") };


            Object.keys( intake ).map(( naming )=>
            {
                detail = intake[naming];

                if ( ([null,undefined]).includes(detail) )
                { this.removeAttribute(naming) }
                else
                { this.setAttribute( naming, detail ) };
            });


            return this;
        },



        enclan ( )
        {
            let invite = ([ ...arguments ]).join(" ").split(" ");
            let exists = (this.className+"").split(" ");
            let result = Object.keys( Object.invert([ ...exists, ...invite ]) );

            this.className = result.join(" ");
            return this;
        },



        declan ( )
        {
            let banish = ([ ...arguments ]).join(" ").split(" ");
            let exists = Object.invert( (this.className+"").split(" ") );

            banish.map(( family )=>
            { delete exists[family] });

            let result = Object.keys( exists );

            this.className = result.join(" ");
            return this;
        },



        reclan ( banish, invite )
        {
            let detect = ((typeof banish) + "," + (typeof invite)).slice(0,13);

            if ( detect === "string,string" )
            {
                this.declan( banish );
                this.enclan( invite );
            }
            else if ( !!banish && (detect === "object,undefi") )
            {
                Object.keys( banish ).map(( relate )=>
                { this.reclan( relate, banish[relate] ) });
            };

            return this;
        },



        relate ( )
        {
            let intake = ([ ...arguments ]).join(" ").split(" ");
            let joined = intake.join("");
            let length = intake.length;
            let number = 0;
            let output = 0;

            // if ( joined.length < 1 )
            // { return (this.className+"").split(" ") };

            switch ( joined )
            {
                case "" : return output;
                case "*" : return (this.className+"");
            };

            intake.map(( family, number )=>
            {
                if ( (this.className+"").includes(family+"") )
                {
                    number ++;
                    output = ( number / length );
                };
            });

            return output;
        },



        belong ( legacy, parent=undefined, levels=999 )
        {
            if ( (typeof legacy) === "string" )
            { legacy = Select(legacy,parent) };

            if ( Array.isArray(legacy) )
            { legacy = legacy[0] };

            if ( !((legacy||0).constructor.name).startsWith("HTML") )
            { return false };

            parent = ( parent || this.parentNode );
            legacy = legacy.outerHTML;

            do
            {
                levels--;

                if ( !parent || (parent.outerHTML === legacy) )
                { return ( !parent ? false : true ) };

                parent = parent.parentNode;
            }
            while ( levels > 0 );

            return false;
        },



        differ ( target, parent )
        {
            if ( (typeof target) === "string" )
            { target = Select(target,parent,false) };

            if ( !target )
            { return true }; // target is fals-ish, though `this` is true-ish

            return ( this.outerHTML !== target.outerHTML );
        },



        select ( )
        {
            let intake = [ ...arguments ];
            let origin = ( Object.getPrototypeOf(this) || {} );
            let native = ( !!origin.select && (origin.select.toString() !== HTMLElement.prototype.select.toString()) );

            if ( native )
            { return this.prototype.select.apply(this,intake) };

            return Select( intake[0], this, intake[1] );
        },



        remove ( )
        {
            let intake = [ ...arguments ];

            return Remove( intake[0], this, intake[1] );
        },



        toggle ( intake )
        {
            if ( !this.toggleSchema )
            {
                this.toggleSchema = {},
                this.toggleStatus = "?";

                this.listen
                ({
                    click ( signal )
                    {
                        let callee = this.toggleSchema[ this.toggleStatus ];

                        if ( !!callee )
                        { return this.toggleSchema[this.toggleStatus](signal) };
                    },
                });
            };


            let detect = Detect( intake );
            let lastUp = this.toggleStatus;
            let indice = Object.keys( this.toggleSchema );
            let length = indice.length;
            let nextUp = ( indice.indexOf(lastUp) + 1 );
            let chosen = ( indice[nextUp] || indice[0] );
            let callee,  option,  picked,  parted,  titled,  family;


            if ( detect === "object" )
            {
                intake = Object.assign( {}, intake );

                Object.keys( intake ).map(( aspect )=>
                {
                    callee = intake[ aspect ];
                    delete intake[ aspect ]; // detach method from object first, else bind is impossible
                    this.toggleSchema[ aspect ] = callee.bind( this );
                });

                return this.toggle();
            };


            if ( !length )
            { return dump("unable to toggle between no options") };


            if ( !!intake && (detect === "string") && !this.toggleSchema[intake] )
            {
                for ( option of indice )
                {
                    if ( option.startsWith(intake) )
                    {
                        chosen = option;
                        break;
                    }
                };

                if ( !this.toggleSchema[chosen] )
                { return dump(`toggle "${intake}" is invalid`) };
            };


            this.toggleStatus = chosen;

            parted = ( chosen || "" ).split("=");
            titled = ( !!parted[1] ? parted[0] : "" ).trim();
            family = ( !!parted[1] ? parted[1] : parted[0] ).trim();
            lastUp = lastUp.split("=").pop().trim();

            this.reclan( lastUp, family );

            if ( !!titled )
            { this.aspect({title:titled}) };

            return this;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: CRUD
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Create ( intake, detail={}, insert )
        {
            let entity = document.createElement( intake );
            let detect = ( typeof insert );


            Object.keys( detail ).map(( aspect )=>
            {
                entity.setAttribute( aspect, detail[aspect] );
            });


            switch ( true )
            {
                case (detect === "string") : entity.innerHTML = insert;  break;
                case (insert instanceof HTMLElement) : entity.appendChild(insert); break;
            };


            return entity;
        },



        Select ( intake, parent, incAll )
        {
            let relate = ( intake || 0 ).constructor.name; // string name
            let output = [],  filter = [],  family,  ignore;


            if ( relate.startsWith("HTML") && ((typeof parent) === "string") && ((typeof incAll) === "number") )
            {
                parent = ( parent.startsWith(".") ? parent.slice(1) : parent );
                output = intake;
                incAll = ( (incAll < 0) ? 0 : incAll );

                while ( incAll > 0 )
                {
                    incAll--;
                    output = output[parent];
                };

                return output;
            };


            if ( (typeof parent) === "boolean" )
            {
                incAll = parent;
                parent = undefined;
            };


            intake = (intake+"");
            parent = ( parent || playerWindow.contentDocument );


            if ( intake.startsWith("*") )
            {
                intake = (intake.slice(1) || "*");

                if ( intake === "*" )
                { return [...(parent.childNodes)] };

                if ( incAll === undefined )
                { incAll = true };
            };


            if ( (typeof incAll) === "string" )
            { incAll = incAll.split(",") };

            try { output = [ ...(parent.querySelectorAll(intake)) ] }
            catch( failed ){ dump(failed) };

            if ( !Array.isArray(incAll) )
            { return ( incAll ? output : output[0] ) };

            filter = output;
            output = [];

            filter.map(( entity )=>
            {
                for ( family of incAll )
                {
                    ignore = family.startsWith("!");
                    family = ( ignore ? family.slice(1) : family );

                    if ( !((ignore && entity.relate(family)) || (!ignore && !entity.relate(family))) )
                    {
                        output.push(entity);
                        break;
                    };
                };
            });

            return output;
        },



        Update ( intake )
        {
            Select( `*[content^="./"]`, intake ).map(( entity )=>
            {
                 entity.innerHTML = Import( entity.getAttribute("content"), Strace("folder") );
            });
        },



        Exists ( intake, parent )
        {
            let exists = Select( intake, parent );

            if ( Array.isArray(exists) )
            { exists = exists[0] };

            return (!!(exists));
        },



        Remove ( intake, parent, incAll )
        {
            if ( (typeof parent) === "boolean" )
            {
                incAll = parent;
                parent = undefined;
            };

            let detect = ( [...arguments].map(( detail )=>{ return (typeof detail).slice(0,3) }) ).join(",");
            let relate = ( intake || 0 ).constructor.name; // string name
            let select = ( (relate === "String") || (relate.startsWith("HTML") && (detect === "obj,str,num")) );
                incAll = ( (incAll !== undefined) ? incAll : ((relate === "String") && intake.startsWith("*")) );
            let output = [];


            switch ( true )
            {
                case ( !intake ) : return; // invalid selection
                case ( select ) : intake = Select(intake,parent,incAll);  break;
                case ( relate === "NodeList" ) : intake = [...intake];  break;
            };


            if ( !Array.isArray(intake) )
            {
                relate = ( intake || 0 ).constructor.name;  // may have changed above in switch case ( select )

                if ( !relate.startsWith("HTML") || !intake.parentNode )
                { return }; // nothing to do

                intake.parentNode.removeChild( intake );
                return intake;
            };


            intake.map(( detail )=>
            {
                output.push( Remove(detail,parent,incAll) );
            });


            return ( incAll ? output : output[0] );
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// update :: content
// ----------------------------------------------------------------------------------------------------------------------------
    Update();
// ----------------------------------------------------------------------------------------------------------------------------





/*
*/



// readme :: info : shared - this file runs client-side and server-side
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------





// import : tools
// ----------------------------------------------------------------------------------------------------------------------------
    const osDisk = require( "node:fs" );
    const osPath = require( "node:path" );
    const hasher = require("./extras.cjs").md5;

    // import * as osDisk from "node:fs";
    // import * as osPath from "node:path";
// ----------------------------------------------------------------------------------------------------------------------------
// praxis : used as references, e.g: osDisk.writeFileSync()





// define :: Modify
// ----------------------------------------------------------------------------------------------------------------------------
    globalThis.Modify = function Modify ( entity )
    {
        return Object.assign( Object.create(this), {entity} );
    }
    .bind
    ({
        assign ( design )
        {
            Reflect.ownKeys( design ).map(( aspect )=>
            { Object.defineProperty( this.entity, aspect, {writable:true, value:design[aspect]} ) });

            return this.entity;
        },


        define ( design )
        {
            Reflect.ownKeys( design ).map(( aspect )=>
            { Object.defineProperty( this.entity, aspect, {configurable:false, writable:false, value:design[aspect]} ) });

            return this.entity;
        },
    });


    Modify( globalThis ).define({ Modify });  // harden
// ----------------------------------------------------------------------------------------------------------------------------





// define :: dump
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        dump: console.log.bind( console ),
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: String.filter
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( String ).define
    ({
        filter ( intake )
        {
            let output = ( intake + "" );

            output = (output).replace(/[^a-z0-9_'-\s\.]/gi, "");
            output = output.trim();

            return output;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: String.parsed
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( String ).define
    ({
        parsed ( intake, object=false )
        {
            let detect = ( typeof intake );

            if ( detect === "string" )
            {
                if ( !object )
                { return intake };

                return JSON.parse( intake );
            };

            if ( detect === "function" )
            {
                if ( !object )
                { return ( "data:text/javascript;base64," + btoa(intake.toString()) ) };

                intake = Object.assign( {}, intake );
            };

            let output = JSON.stringify( intake, null, 4 );

            if ( !object )
            { return output };

            return JSON.parse( output ); // clean object clone
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: tools
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Disk: osDisk,
        Path: osPath,

        Hash ( intake )
        {
            return ( "tmd5" + hasher(String.parsed(intake)) );
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: Strace
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Strace ( intake )
        {
            let strace = ((new Error(".")).stack.split("\n").slice(2));
            let string;


            for ( string of strace )
            {
                let sample = string.trim().split("at ").pop();

                if ( sample.startsWith("/") || (sample.slice(1,2)===":\\") )
                { sample = `file://${sample}` };

                if ( sample.startsWith("file://") )
                { sample = `anonymous (${sample})` };

                let parted = sample.split(" ");
                let naming = parted[0];
                let source = parted[1].slice(1,-1).split("file://").pop();

                switch ( intake )
                {
                    case "source" : return source;
                    case "folder" : return source.split("/").slice(0,-1).join("/");
                };
            };


            return strace;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: CRUD
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Import ( target, origin )
        {
            if ( !origin )
            { origin = Strace("folder") };

            target = Path.join( origin, target );

            let ending = target.split(".").pop();
            let exists = Disk.existsSync( target );

            if ( !exists )
            { return }; // undefined

            exists = Disk.lstatSync( target );

            switch ( true )
            {
                case ( exists.isSymbolicLink() ) : return Import( Disk.readlinkSync(target) );
                case ( exists.isDirectory() ) : return Disk.readdirSync( target );
                case ( !exists.isFile() ) : return;
                case ( ("cjs,js").includes(ending) ) : return require( target );
            };

            exists = Disk.readFileSync( target, {encoding:"utf8"} );

            return ( (ending === "json") ? JSON.parse(exists) : exists );
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: Handle
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Handle: function Handle ( entity )
        {
            if ( (typeof entity) === "string" )
            { entity = Select(entity,false) };

            return Object.assign( Object.create(this), {entity} );
        }
        .bind
        ({
            entrap ( design, keeper, minder )
            {
                if ( !!this.entity.minder )
                { return this.entity.minder.keeper.alt(design) };

                design = ( design || {} );
                minder = this;

                keeper = Modify( (keeper || {}) ).assign
                ({
                    alt: function alt ( action, aspect, detail )
                    {
                        if ( !action )
                        { return this }; // whole alternative object

                        if ( (typeof action) === "object" )
                        {
                            Modify( this ).assign( action );
                            return this.router;
                        };

                        let intake = [ this, ...([ ...arguments ].slice(2)) ];
                        let holder = (this.entity || this);

                        if ( (aspect in this)  )
                        {
                            if ( (typeof this[aspect][action]) === "function" )
                            { return this[aspect][action](...intake) };

                            holder = this;
                        };

                        switch ( action )
                        {
                            case "get" : return ( holder )[ aspect ];
                            case "has" : return ( aspect in holder );
                            case "set" : return ( (holder[aspect]=detail) ? true : true );
                        };
                    },


                    get ( ){ return this.alt( "get", ...([...arguments].slice(1,-1)) ) },
                    has ( ){ return this.alt( "has", ...([...arguments].slice(1,-1)) ) },
                    set ( ){ return this.alt( "set", ...([...arguments].slice(1,-1)) ) },
                });


                minder.keeper = keeper;
                minder.router = new Proxy( minder.entity, keeper );

                minder.keeper.alt = minder.keeper.alt.bind( minder );
                Modify( this.entity ).define({ minder });
                return minder.keeper.alt( design );
            },



            listen ( events )
            {
                let enhook = ( this.entity.on ? "on" : "addEventListener" );

                if ( (typeof this.entity[enhook] !== "function") )
                { return dump(`expecting event emitter`) };

                if ( !events || ((typeof events)!=="object") )
                { return dump(`expecting intake as object`) };

                Object.keys( events ).map(( action )=>
                {
                    if ( (typeof events[action]) !== "function" )
                    { return }; // expecting function

                    this.entity[ enhook ]( action, events[action] );
                });

                return ( this.entity.minder ? this.entity.minder.router : this );
            },


        })
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: tools
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( Object ).define
    ({
        invert ( intake )
        {
            let output = {};
            let bArray = Array.isArray(intake);

            ( bArray ? intake : Object.keys((intake||{})) ).map(( detail, aspect )=>
            {
                aspect = ( bArray ? detail : (intake[detail]+"") );
                detail = ( bArray ? aspect : detail );

                output[ aspect ] = detail;
            });

            return output;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: Config : e.g:  Config("foo") -> select value by property name  ...  Config({bar:1}) -> assign properties in source
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Config ( intake, target, source="./player/global/config.json" )
        {
            let detect = ( typeof intake );

            if ( !target )
            { target = source }

            if ( (typeof target) === "string" )
            { source = target };

            if ( !Disk.existsSync(source) )
            { return dump("undefined path: " + source) };

            let exists = Disk.readFileSync( source, {encoding:"utf8"} );
            let config = JSON.parse( exists );

            if ( !intake || !("string,object").includes(detect) )
            { return }; // invalid


            if ( detect === "string" )
            {
                if ( intake === "*" )
                { return config };

                if ( !config[intake] && ((typeof target) === "object") )
                { return Config( target, source )[ intake ] };

                return config[intake];
            };


            let buffer = JSON.stringify( intake );

            if ( buffer === exists )
            { return config }; // nothng changed

            Object.assign( config, intake );
            Disk.writeFileSync( source, JSON.stringify(config,null,4) );
            return config;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------

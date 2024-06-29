

// readme :: info : front-end - this file runs client-side
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------





// import :: tools
// ----------------------------------------------------------------------------------------------------------------------------
    require( "./client.cjs" );
// ----------------------------------------------------------------------------------------------------------------------------





// define :: Player :
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( globalThis ).define
    ({
        Player: Handle( Select("#Player") ).entrap
        ({
            device: Select( "*#playItem audio" ),



            design:
            {
                menuItem: Remove( "#menuItemPlan" ).outerHTML,
                playItem: Remove( "#playItemPlan" ).outerHTML,
            },



            starts ()
            {
                Player.listen
                ({
                    keydown ( signal )
                    {
                        if ( (signal.key !== "Escape") || !signal.target.differ(Player.preset) )
                        { return };

                        Remove( ["*.handle.afloat","#focusLayer","*.scrollBox.afloat.ontop"] );
                    },


                    mousedown ( signal )
                    {
                        if ( !signal.target.belong(".scrollBox.afloat.ontop") && signal.target.differ(Player.preset) )
                        {
                            Remove( ["#focusLayer","*.scrollBox.afloat.ontop"] );
                        };
                    },
                });

                Player.origin.detail = Config( "origin", {origin:Player.origin.detail} );

                if ( !Player.preset.locate(Config("preset")) )
                {
                    Player.preset.update( true );
                    Player.preset.chosen = ( Object.keys(Player.preset.memory)[0] || Player.preset.chosen );

                    if ( !Player.preset.locate(Player.preset.chosen) )
                    { Player.preset.retain() };

                    Config( {preset:Player.preset.chosen} );
                };

                Player.preset.detail = Config( "preset", {preset:Player.preset.detail} );
            },



            awaits ( callee, timing=0 )
            {
                let hashed = Hash( callee );

                if ( !Player.awaits[hashed] )
                { Player.awaits[hashed] = null };

                clearTimeout( Player.awaits[hashed] );
                Player.awaits[hashed] = setTimeout( callee, 0 );
            },



            search ( holder, intake, signal )
            {
                let parent = Select( "#" + holder );
                let filter = (intake.value+"").split('"').join('\\"');
                let locase = filter.toLowerCase();
                let hicase = filter.toUpperCase();


                if ( (filter.length < 1) || (signal.key === "Escape") )
                {
                    intake.value = "";

                    Select( "*.hidden", parent ).map(( entity )=>
                    { entity.declan("hidden") });

                    if ( (holder === "menuList") )
                    { return };

                    if ( Exists("#presetChoice") )
                    { return Remove("*#focusLayer,#presetChoice") };

                    return Player.preset.choose();
                };


                if ( signal.keyCode === 13 )
                {
                    if ( (holder === "menuList") )
                    { Player.origin.browse(intake.value) };

                    return;
                };


                Remove("*#focusLayer,#presetChoice");


                let ticase = filter.split(" ").map(( string )=>
                { return ( (string[0]||"").toUpperCase() + string.slice(1).toLowerCase() ) }).join(" ");

                let search = ([ filter, ticase, locase, hicase ]).map(( select )=>
                { return `[name*="${select}"]` }).join(",");

                let exists = Select( search, parent, true );


                Select( "*", parent ).map(( entity )=>
                { entity.enclan("hidden") });

                exists.map(( entity )=>
                { entity.declan("hidden") });
            },



            timing ( intake )
            {
                let difHrs, difMin, difSec;
                let remain = ( intake * 1 );
                let output = [];

                if ( !intake || (intake<0) )
                { return "00:00" };

                difHrs = Math.trunc( remain / 3600 );
                remain = ( remain % 3600 );

                difMin = Math.trunc( remain / 60 );
                difSec = Math.trunc( remain % 60 );
                output = [ difMin, difSec ];

                if ( difHrs > 0 )
                { output.unshift(difHrs) };

                output = output.map(( sector )=>{ return (((sector < 10) ? "0" : "") + sector) });
                output = output.join(":");

                if ( output.startsWith("0") )
                { output = output.slice(1) };

                return output;
            },



            create ( schema="playItem", change={} )
            {
                let holder = document.createElement( "div" );
                let output, target, htmTag, aspect, detail;

                holder.innerHTML = Player.design[ schema ];
                output = holder.childNodes[0];
                output.removeAttribute( "id" );

                Object.keys( change ).map(( search )=>
                {
                    detail = change[ search ];
                    delete change[ search ];

                    if ( (typeof detail) === "function" )
                    {
                        aspect = search;
                        return output.listen( {[aspect]:detail} );
                    };

                    target = Select( search, output );
                    htmTag = ((target||{}).nodeName||"").toLowerCase();
                    aspect = ( ("input").includes(htmTag) ? "value" : "innerHTML" );

                    if ( !htmTag )
                    { return dump("Player.create :: invalid selector : "+search) };

                    if ( ([null,undefined]).includes(detail) )
                    { return Remove(target) };

                    target[aspect] = detail;
                });

                return output;
            },



            handle: function handle ( entity, signal, extras={} )
            {
                Player.awaits(()=>
                {
                    let intake = Select( ".menuItemText,.text.name", entity );
                    let exists = Select( ".handle.busy", Player.entity );


                    if  ( !!exists )
                    {
                        Select( ".button", exists ).intake.focus();
                        return Remove( ".handle", Player.entity, "!busy" );
                    };

                    clearTimeout( entity.timing );
                    entity.timing = setTimeout(()=>
                    {
                        if ( intake.aspect("readonly") )
                        { Remove( ".handle", entity ) };
                    },2000);

                    if ( Exists(".handle",entity) )
                    { return };


                    Remove( ".handle", Player.entity, "!busy" );
                    intake.placeholder = entity.detail.naming;
                    entity.focus();

                    let rawHtm = '<grow><gcel class="inactive"></gcel><gcel class="icon"></gcel></grow>';
                    let ovrlay = Create( "grid", {class:"handle afloat"}, rawHtm );
                    let holder = Select( ".icon", ovrlay );
                    let hidden = ( extras.hidden || "" );
                    let render = ( extras.render || {} );
                    let merged = Object.assign( render, this );

                    Object.keys( merged ).map(( action )=>
                    {
                        let callee = merged[action] ;

                        if ( (typeof callee) !== "function" )
                        { return }; // not interested

                        let button = Create( "div" );
                        let family = this.family[ action ];
                        let target = entity.detail.target;
                        let handle = extras[action];
                        let finish = ( extras.finish || (function (){}) );

                        button.assign( { refer: entity, intake, target, parent:ovrlay, family:this.family, handle, finish } );
                        button.aspect( { class: `button ${family}`, title:action } );
                        button.listen( { click: callee } );

                        if ( button.relate(hidden) )
                        { button.enclan("hidden") };

                        holder.append( button );

                    });

                    entity.append( ovrlay );

                }, 5);
            }
            .bind
            ({
                family:
                {
                    rename: "icon-format-border-style shut",
                    retain: "icon-save1",
                    delete: "icon-trash-alt1",
                    moveUp: "icon-arrow-up1",
                    moveDn: "icon-arrow-down1",
                },


                rename ( signal )
                {
                    let family = this.family;

                    signal.stopImmediatePropagation();
                    signal.stopPropagation();
                    signal.preventDefault();


                    if ( !!this.relate("shut") )
                    {
                        this.reclan( { "shut":"open", "hidden":"", [family.rename]:family.retain } );
                        this.parent.enclan( "busy" );
                        Select( "grid", this.refer ).declan( "inactive" );
                        this.intake.aspect( {readonly:null} );
                        Player.awaits(()=>{ this.intake.focus() },10);
                        return;
                    };

                    // open :: busy
                    let origin = this.target;
                    let parent = origin.split("/").slice(0,-1).join("/");
                    let folder = this.refer.detail.folder;
                    let naming = this.intake.value.split("/").pop().trim();
                    let ending = ( folder ? "" : ("."+origin.split(".").pop()) );
                        ending = ( (!ending || naming.endsWith(ending)) ? "" : ending );
                    let target = ( parent + "/" + naming + ending );
                    let failed = false;


                    if ( !!naming && (target !== origin) && Disk.existsSync(target) )
                    {
                        alert( "already exists:\n" + target );
                        return this.intake.focus();
                    };


                    if ( !naming || (target === origin) )
                    {
                        this.intake.value = (naming || this.intake.placeholder); // nothing to do
                    }
                    else
                    {
                        try
                        {
                            if ( !!this.handle )
                            { this.handle( origin, target ) }
                            else
                            { Disk.renameSync( origin, target ) };

                            this.intake.placeholder = naming;
                            Object.assign( this.refer.detail, {naming,target} );
                            Player.preset.retain();
                        }
                        catch ( failed )
                        {
                            console.error( failed );
                            alert( failed );
                            return this.intake.focus();
                        };
                    };

                    this.reclan( { "open":"shut", [family.retain]:family.rename } );
                    this.parent.declan( "busy" );
                    Select( "grid", this.refer ).enclan( "inactive" );
                    this.intake.aspect( {readonly:true} );

                    if ( this.refer.detail.failed )
                    {
                        delete this.refer.detail.failed;
                        this.refer.declan( "fail" );
                        Player.invoke( "pick", this.refer );
                    };

                    this.finish( "rename", origin, target, this.refer.detail );
                },


                delete ( signal )
                {
                    signal.stopImmediatePropagation();
                    signal.stopPropagation();
                    signal.preventDefault();

                    let target = this.target;
                    let entity = this.refer;
                    let detail = entity.detail;
                    let answer = confirm( "Deleting: " + target + "\n\n" + "Are you sure?" );

                    if ( !answer )
                    { return }; // do nothing

                    Remove( entity );
                    Select( "#savePlaylist" ).enclan( "remind" );
                    try
                    {
                        if ( detail.folder )
                        { Disk.rmSync(target,{force:true,recursive:true}) }
                        else
                        { Disk.unlinkSync(target) };
                    }
                    catch ( failed )
                    { return alert(failed) };
                    this.finish( "delete", target, null, entity.detail );
                },
            }),



            import ( target, indent=0 )
            {
                target = (target+"");

                if ( !target.includes("/") )
                { target = Player.preset.locate( target, target ) };

                let exists = Disk.existsSync( target );
                let naming = String.filter( target.split("/").pop().split(".").slice(0,-1).join(".") );

                let miming =  Player.origin.miming;
                let result = {}, detail={}, signal={}, folder=false, linked;

                if ( !exists )
                { return alert(`undefined path: ${target}`) }; // undefined

                exists = Disk.lstatSync( target );
                linked = exists.isSymbolicLink(); // boolean for if it's a short-cut


                if ( linked )
                {
                    target = Disk.readlinkSync( target );
                    exists = Disk.lstatSync( target );
                };


                Object.assign( result, {naming, folder, indent, target, detail, signal} );

                if ( exists.isFile() )
                {
                    result = Config( "*", target );
                    return result;
                };

                if ( !exists.isDirectory() )
                { return alert(`unsupported path: ${target}`) };

                try { result.folder = Disk.readdirSync(target) }
                catch ( failed )
                {
                    result.detail = failed;
                    return result;
                };


                result.folder.map(( aspect )=>
                {
                    let source = (`${target}/${aspect}`).split("//").join("/"); // absolute path to current item
                    let ending = aspect.split(".").pop();
                        exists = undefined;
                        naming = String.filter( aspect.includes(".") ? aspect.split(".").slice(0,-1).join(".") : aspect );

                    if ( aspect.startsWith(".") )
                    { return }; // ignore hidden

                    exists = Disk.lstatSync( source );
                    linked = exists.isSymbolicLink();

                    if ( linked )
                    {
                        source = Disk.readlinkSync( source );

                        if ( Disk.existsSync(source) )
                        { exists = Disk.lstatSync(source) };
                    };

                    folder = exists.isDirectory();

                    if ( miming.includes(ending) || folder )
                    { result.detail[aspect] = {naming, folder, indent:(indent+1), target:source, detail:{}} };
                });

                return result;
            },



            origin: Handle( Select("#folderPath") )
            .entrap
            ({
                miming: Config( "miming" ),


                detail:
                {
                    get ( minder )
                    { return (minder.entity.title || process.env.HOME) },

                    set ( minder, detail )
                    {
                        minder.browse( detail, "menuList" );
                        return true;
                    },
                },


                parent: Handle( Select("[title='browse parent path']") )
                .listen
                ({
                    click ()
                    {
                        Player.origin.detail = ( Player.origin.detail.split("/").slice(0,-1).join("/") || "/" );
                    },
                }),


                append: Handle( Select("[title='append to playlist']") )
                .listen
                ({
                    click ()
                    {
                        Player.render( Player.origin.detail, "playList" );
                    },
                }),


                browse ( detail )
                {
                    if ( (typeof detail) === "string" )
                    {
                        detail = Player.import( detail );
                    };


                    Player.awaits(()=>
                    {
                        let signal = (detail.signal||{}).type;
                        let origin = detail.target;

                        if ( (signal === "click") && (detail.folder === true) )
                        { return Player.origin.toggle(detail) }; // handle dblclick next

                        // clearTimeout( Player.awaits.timing ); // ignore 2nd single click upon dblclick

                        if ( !detail.folder )
                        { return Player.render([Player.preset.primed(detail)],"playList") };

                        Player.origin.title = origin;
                        Player.origin.placeholder = origin;

                        Player.render( Player.import(origin), "menuList" );
                        Config( {origin} );
                    }, 300);
                },


                toggle ( detail )
                {
                    let entity = detail.entity;
                    let emblem = Select( ".togl i", entity );
                    let sprout = Select( ".menuItemDrop", entity );
                    let indent = detail.indent;

                    if ( sprout.className.endsWith("shut") )
                    {
                        emblem.className = "icon-chevron-down";
                        sprout.className = "menuItemDrop open";

                        Player.render( Player.import(detail.target,indent), "menuList", sprout, indent ); // open
                    }
                    else
                    {
                        emblem.className = "icon-chevron-right";
                        sprout.className = "menuItemDrop shut";
                        sprout.innerHTML = ""; // shut
                    };
                },



                tunnel ( intake, dejavu=false )
                {
                    let ending, parted, target, exists, linked, folder, isFile, object;
                    let output = [];

                    Disk.readdirSync( intake ).map(( naming )=>
                    {
                        if ( naming.startsWith(".") )
                        { return }; // ignore hidden

                        target = `${intake}/${naming}`;
                        parted = naming.split(".");
                        naming = String.filter( parted.slice(0,-1).join(".") );
                        ending = parted.pop();
                        exists = Disk.lstatSync( target );
                        linked = exists.isSymbolicLink(); // boolean for if it's a short-cut

                        if ( linked )
                        {
                            target = Disk.readlinkSync( target );
                            exists = Disk.lstatSync( target );
                        };

                        folder = exists.isDirectory();
                        isFile = exists.isFile();
                        object = Player.preset.primed( Player.preset.cached[naming] || { naming, target } );

                        if ( (!folder && !isFile) || (isFile && !Player.origin.miming.includes(ending)) )
                        { return }; // not interesting

                        if ( !folder )
                        {
                            Player.preset.cached[ naming ] = object;
                            return output.push(object);
                        };

                        this.tunnel( target, true ).map(( record )=>
                        { output.push(record) });
                    });


                    if ( !dejavu )
                    { Config( Player.preset.cached, "./player/memory/cached.json" ) };

                    return output;
                },
            })
            .listen
            ({
                keyup ( signal )
                {
                    Player.search( "menuList", this, signal );
                },
            }),



            preset: Handle( Select("#filterPlaylist") )
            .entrap
            ({
                chosen: "recent",
                joiner: " :: ",
                active: "?",
                prefix: "./player/memory/prefix.list",
                cached: Config( "*", "./player/memory/cached.json" ),
                memory: {},


                detail:
                {
                    get ( minder )
                    { return minder.chosen },

                    set ( minder, detail )
                    {
                        let parted = ((detail || "") + "").split( minder.joiner );

                        minder.chosen = ( parted[0] || "recent" );
                        minder.active = ( parted[1] || "?" );
                        return minder.update();
                    },
                },


                locate ( source, backup )
                {
                    source = ( source || backup || Player.preset.chosen );

                    if ( !source.includes("/") )
                    { source = `${this.prefix}/${source}.json` };

                    if ( Disk.existsSync(source) )
                    { return source };

                    if ( !!backup && !backup.includes("/") )
                    { backup = `${this.prefix}/${backup}.json` };

                    return backup; // or undefined if no backup was given
                },



                recall ( source, select )
                {
                    source = this.locate( source, (source || Player.preset.chosen) );
                    select = String.parsed( (select || "*") );

                    return Config( select, source );
                },



                forget ( source )
                {
                    delete this.memory[ source ];
                    source = this.locate( source );

                    if ( !source )
                    { return true };

                    return Disk.unlinkSync( source );
                },



                rename ( source, target )
                {
                    let entity = Player.preset;
                    let memory = entity.memory;
                    let detail = ( memory[target] || [] );

                    memory[ target ] = ( memory[source] || [] );
                    delete memory[ source ];

                    if ( !entity.locate(source) )
                    { return entity.retain(target,detail) };

                    Disk.renameSync( entity.locate(source), entity.locate(target,target) );

                    if ( entity.chosen === source )
                    {
                        Config( {preset:target} );
                        entity.detail = target;
                    };
                },


                retain: Handle( function retain ( source, detail )
                {
                    source = ( source || Player.preset.detail );

                    if ( !Array.isArray(detail) )
                    {
                        detail = Select( "*.playListItem", Select("#playList") ).map(( entity )=>
                        { return entity.detail });
                    };

                    this.memory[ source ] = detail;
                    Disk.writeFileSync( this.locate(source,source), JSON.stringify(detail,null,4) );
                    Select( "#savePlaylist" ).declan( "remind" );
                })
                .entrap
                ({
                    entity: Select( "[title='save playlist']" ),
                })
                .listen
                ({
                    click ()
                    {
                        Player.preset.retain();
                    },
                }),


                vacuum: Handle( function vacuum ( memory=false )
                {
                    Select( "*.playListItem", Select("#playList") ).map(( entity )=>
                    { entity.className = "playListItem hidden" });

                    if ( !memory )
                    { return };

                    Player.preset.entity.value = "";
                    Select( "#playList" ).innerHTML = ""; // removes all playItems
                    Select( "#savePlaylist" ).enclan( "remind" );

                    if ( !!Player.preset.memory[ Player.preset.chosen ] )
                    { Player.preset.memory[ Player.preset.chosen ] = [] };
                })
                .entrap
                ({
                    entity: Select( "[title='clear playlist']" ),
                })
                .listen
                ({
                    click ()
                    {
                        Player.preset.vacuum( true ); // hard
                    },
                }),


                update ( choice=false )
                {
                    let titled = ( this.chosen + this.joiner + this.active );

                    if ( this.entity.placeholder === titled )
                    { return true };

                    this.entity.title = titled;
                    this.entity.placeholder = titled;

                    Disk.readdirSync( this.prefix ).sort().map(( option )=>
                    {
                        option = option.split(".").slice(0,-1).join(".");

                        if ( !!option && !this.memory[option] )
                        { this.memory[option] = [] };
                    });

                    if ( choice )
                    { return };

                    this.vacuum( true );
                    Player.render( Player.import(this.locate(this.chosen)), "playList" );
                    return true;
                },


                choose ()
                {
                    Remove( "*#focusLayer,#presetChoice" );
                    this.update( true );

                    let custom = "new playlist",  detail,  option,  naming;
                    let indice = [ custom, ...(Object.keys( this.memory ).sort()) ];
                    let veneer = Create( "div", {id:"focusLayer"} );
                    let holder = Create( "div", {id:"presetChoice", class:"scrollBox afloat ontop"} );
                    let grower = Create( "div", {class:"enwrap"} );


                    indice.map(( string )=>
                    {
                        option = Player.create( "playItem",
                        {
                            ".text.name": string,
                            ".text.from": null,
                            ".text.time": null,

                            mousemove ( signal )
                            {
                                Player.handle( this, signal,
                                {
                                    hidden: ( (this.intake.placeholder === this.custom) ? "button" : "" ),
                                    rename ( origin, target )
                                    {
                                        origin = ( !origin.includes("/") ? origin : origin.split("/").pop() );
                                        origin = ( !origin.endsWith(".json") ? origin : origin.slice(0,-5) );

                                        target = ( !target.includes("/") ? target : target.split("/").pop() );
                                        target = ( !target.endsWith(".json") ? target : target.slice(0,-5) );

                                        Player.preset.rename( origin, target );
                                    },
                                });
                            },


                            click ( signal )
                            {
                                if ( this.intake.placeholder === this.custom )
                                {
                                    if ( this.intake.value === this.custom )
                                    { this.intake.value = "" };

                                    let exists = this.select(".handle .button[title='rename']");

                                    if ( !exists )
                                    { return };

                                    setTimeout(()=>{ this.intake.focus() },200);
                                    return exists.signal( "click" );
                                };

                                Player.preset.detail = this.intake.value;
                                Config( {preset:this.intake.value} );
                                Remove( "*#focusLayer,#presetChoice" );
                            },
                        });


                        option.assign
                        ({
                            custom,
                            detail: { naming:string, target:this.locate(string,string) },
                            intake: Select( ".text.name", option ),

                            forget ()
                            {
                                dump("forget: ",this.detail.naming);
                            }
                        });


                        if ( string === custom )
                        {
                            option.enclan( "formBox" );
                            option.intake.assign( { value:"", placeholder:custom } );
                            option.intake.listen({ blur ()
                            {
                                setTimeout(()=>
                                {
                                    Player.preset.detail = this.value;
                                    Config( {preset:this.value} );
                                    Remove( "*#focusLayer,#presetChoice" );
                                },250)
                            }});
                        }


                        grower.append( option );
                    });


                    Select( "#playList" ).parentNode.append( veneer );
                    Select( "#presetHolder" ).append( holder.append(grower) );
                },



                primed ( detail )
                {
                    let output = { naming:"", target:"", length:0, rating:0, seeker:0, failed:false, ignore:{}, volume:{} };
                    let expect = Object.keys( output );
                    let supply = String.parsed( detail, true );

                    // both `ignore` and `volume` are as such: { [fromTimeNumber]: numberValue }
                    // this makes it possible to ignore parts of the song and adjust the volume of other parts
                    // represented in JSON like:  { "ignore": { "9553.4492" : 9976.6749 },  "volume": { "9976.6749" : 0.75 } }

                    Object.keys( supply ).map(( aspect )=>
                    {
                        if ( !expect.includes(aspect) )
                        { delete supply[aspect] };
                    });

                    return Object.assign( output, supply );
                },



                select ( intake )
                {
                    if ( intake === "*" )
                    { return Select( "*.playListItem", Select("#playList") ).map(( entity )=>{ return entity.detail }) };
                },
            })
            .listen
            ({
                keyup ( signal )
                {
                    Player.search( "playList", this, signal );
                },


                click ( signal )
                {
                    if ( Exists("#presetChoice") )
                    { return Remove("*#focusLayer,#presetChoice") };

                    Player.preset.choose();
                },
            }),



            invoke: function invoke ( action, entity, option, detain=1 )
            {
                Player.awaits(()=>
                {
                    // clearTimeout( Player.awaits.timing ); // ignore 2nd single click upon dblclick
                    this[ action ]( entity, option );
                }, detain);
            }
            .bind
            ({
                pick ( entity, picked=false )
                {
                    switch ( true )
                    {
                        // case ( picked ) : entity.focus();
                        case ( !entity.settle ) : entity.settle = function (){};
                        case ( !!entity.detail.length ) : return entity.settle();
                        case ( !!entity.detail.failed ) : entity.enclan( "fail" );  return entity.settle();
                    };

                    entity.buffer = ( new Audio() )
                    .assign
                    ({
                        parent: entity,
                        src: entity.detail.target,
                    })
                    .listen
                    ({
                        error ()
                        {
                            this.parent.settle();

                            if ( !this.parent.detail.length )
                            {
                                this.parent.enclan( "fail" );
                                this.parent.detail.failed = true;
                            };
                        },

                        loadedmetadata ()
                        {
                            this.parent.detail.length = this.parent.buffer.duration;
                            Player.preset.cached[ this.parent.detail.naming ] = this.parent.detail;
                            Select( ".text.time", this.parent ).value = Player.timing( this.parent.detail.length );

                            this.src = ""; // stop loading this item's media source
                            delete this.parent.buffer; // free the DOM (memory) from this media element
                            this.parent.settle();
                        },
                    });
                },


                play ( entity )
                {
                    dump( "play", entity.detail );
                },


                wait (){},


                stop (){},
            }),



            render: function render ( intake, target, parent=null, indent=0 )
            {
                parent = ( parent || Select(`#${target}`) );
                this[target]( intake, parent, indent );
            }
            .bind
            ({
                menuList ( object, parent, indent )
                {
                    parent.innerHTML = "";

                    Object.keys(object.detail).map(( aspect )=>
                    {
                        let detail = object.detail[aspect];
                        let entity = Player.create( "menuItem" );
                        let handle = Select( ".menuItemLine", entity );

                        let picker = function picker ( signal )
                        { Player.origin.browse( Object.assign(this.detail,{signal}) ) };

                        let minder = function minder ( signal )
                        {
                            Player.handle( this, signal,
                            {
                                finish ( action, origin, target, detail )
                                {
                                    let holder = Select( "#playList" );
                                    let folder = detail.folder;
                                    let parent = ( folder ? origin : origin.split("/").slice(0,-1).join("/") );
                                    let naming = origin.split("/").pop();
                                        naming = ( detail.folder ? naming : naming.split(".").slice(0,-1).join(".") );
                                    let search = ( folder ? `*[data-from="${parent}"]` : `*[name="${naming}"]` );

                                    holder.select( search ).map(( entity )=>
                                    {
                                        if ( action === "delete" )
                                        { return Remove(entity) };


                                    });
                                },
                            });
                        };

                        Select( ".dent", entity ).style.width = ( (indent*15) + "px" );
                        Select( ".menuItemText", entity ).value = aspect;

                        if ( !detail.folder )
                        {
                            Select( ".togl", entity ).innerHTML = "";
                            Select( ".icon i", entity ).className = "icon-new-audio-alarm";
                            Remove( ".menuItemDrop", entity );
                        };

                        Object.assign( detail, {entity} );
                        handle.assign( {detail} );
                        entity.aspect( {name:detail.naming} );

                        handle.listen
                        ({
                            click: picker,
                            dblclick: picker,
                            mousemove: minder,
                            // mouseout: minder,
                        });

                        // handle.addEventListener( "click", function handle (signal)
                        // { Player.origin.browse(Object.assign(this,{signal})) }.bind(detail));
                        //
                        // handle.addEventListener( "dblclick", function handle (signal)
                        // { Player.origin.browse(Object.assign(this,{signal})) }.bind(detail));

                        parent.append( entity );
                    });
                },


                playList ( intake, parent )
                {
                    intake = ( ((typeof intake) === "string") ? Player.origin.tunnel(intake) : intake );

                    if ( !Array.isArray(intake) || (intake.length<1) )
                    { return }; // done, or invalid

                    // let length = intake.length;
                    let entity = this.playItem( intake.shift(), parent );

                    if ( !entity )
                    { return Player.render( intake, "playList", parent ) }; // error rendering playItem, but let's keep going

                    entity.settle = function settle ()
                    {
                        if ( !this.intake )
                        { return }; // done

                        if ( this.intake.length < 1 )
                        {
                            Config( Player.preset.cached, "./player/memory/cached.json" );

                            let before = String.parsed( Player.preset.recall() );
                            let active = String.parsed( Player.preset.select("*") );
                            let button = Select( "#savePlaylist" );

                            button.declan("remind");

                            if ( active !== before )
                            {
                                button.enclan("remind");
                            };
                        };

                        Player.render( this.intake, "playList", this.parent );

                        delete this.intake;
                        delete this.parent;
                    }
                    .bind({ intake, parent });

                    Player.invoke( "pick", entity, false );
                },


                playItem ( detail, parent )
                {
                    let naming = detail.naming;
                    let folder = detail.target.split("/").slice(0,-1).join("/");
                    let exists = Select( `[name="${naming}"]`, parent );

                    if ( !!exists )
                    { return exists };

                    let entity = Player.create( "playItem",
                    {
                        ".text.name": naming,
                        ".text.from": detail.target.split( "/" ).slice(-2,-1)[0],
                        ".text.time": Player.timing( detail.length ),

                        click ( signal )
                        { Player.invoke( "pick", this, true ) },

                        dblclick ( signal )
                        { Player.invoke( "play", this, true, 300 ) },


                        mousemove ( signal ){ Player.handle( this, signal, {render:
                        {
                            moveUp ()
                            {
                                let sister = this.refer.previousSibling;

                                if ( !sister )
                                { return };

                                let entity = Remove( this.refer );
                                sister.parentNode.insertBefore(entity,sister);
                                Select( "#savePlaylist" ).enclan("remind");
                            },

                            moveDn ()
                            {
                                let sister = ( this.refer.nextSibling || {} ).nextSibling;

                                if ( !sister )
                                { return };

                                let entity = Remove( this.refer );
                                sister.parentNode.insertBefore(entity,sister);
                                Select( "#savePlaylist" ).enclan("remind");
                            },
                        }})},
                    });

                    entity.detail = detail;
                    entity.aspect( {name:naming, "data-from":folder} );

                    Select( "#playList" ).append( entity );
                    return entity;
                },


                waveForm ( detail, parent )
                {

                },
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------





// invoke :: Player.starts
// ----------------------------------------------------------------------------------------------------------------------------
    Player.starts();
// ----------------------------------------------------------------------------------------------------------------------------





/*
*/

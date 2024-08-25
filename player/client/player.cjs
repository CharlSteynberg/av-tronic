

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
        Player: Handle( "#Player" )
        .listen
        ({
            starts ( signal )
            {
                if ( signal.defaultPrevented )
                { return dump("default prevented: Player.starts() ") };

                Player.gadget.starts();
                Player.origin.starts();
                Player.preset.starts();
            }
        })
        .entrap
        ({
            design:
            {
                menuItem: Remove( "#menuItemPlan" ).outerHTML,
                playItem: Remove( "#playItemPlan" ).outerHTML,
            },



            revive ( callee )
            {
                let browse = Select( "#menuList" ).parentNode;
                let seeker = Player.gadget.seeker;
                let layout = Select( "#mainDeck" );
                    callee = ( callee || (function(){}) );

                layout.declan( "hidden" );


                if ( callee === "viewing" )
                {
                    if ( Select("#viewMode").title === "viewing" )
                    {
                        Player.awaits(()=>
                        {
                            if ( Select("#viewMode").title === "viewing" )
                            { layout.enclan("hidden") };
                        },2000);
                    };

                    return;
                };


                browse.enclan( "hidden" );
                seeker.enclan( "hidden" );

                Player.awaits(()=>
                {
                    browse.style.height = ( (browse.parentNode.offsetHeight - 6) + "px" );
                    seeker.style.width = ( seeker.parentNode.offsetWidth + "px" );

                    browse.declan( "hidden" );
                    seeker.declan( "hidden" );

                    if ( (typeof callee) === "function" )
                    { callee() };
                });
            },



            awaits ( callee, timing=0 )
            {
                let hashed = Hash( callee );

                if ( !Player.awaits[hashed] )
                { Player.awaits[hashed] = null };

                clearTimeout( Player.awaits[hashed] );
                Player.awaits[hashed] = setTimeout( callee, timing );
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

                    if ( filter.length < 1 )
                    { Select("#savePlaylist").toggle("save") };

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
                { return `[name*="${select}"],[data-from*="${select}"]` });

                let exists = Select( search.join(","), parent, true );


                Select( "*", parent ).map(( entity )=>
                { entity.enclan("hidden") });

                exists.map(( entity )=>
                { entity.declan("hidden") });

                if ( exists.length < 1 )
                { return };

                Select( "#savePlaylist" ).toggle( "new" );
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
                let holder = Create( "div" );
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
                    let intake =  entity.select( "*.menuItemText,.text" ).pop();
                    let exists =  Player.entity.select( ".handle.busy" );


                    if  ( !!exists )
                    {
                        exists.select( ".button" ).intake.focus();
                        return  Player.entity.remove( ".handle", "!busy" );
                    };

                    clearTimeout( entity.timing );
                    entity.timing = setTimeout(()=>
                    {
                        if ( intake.aspect("readonly") )
                        {
                            entity.remove( ".handle" );
                            entity.blur();
                        };
                    },2000);

                    if ( Exists(".handle",entity) )
                    { return };


                    Player.entity.remove( ".handle", "!busy" );
                    intake.placeholder = ( intake.value || entity.detail.naming );
                    entity.focus();

                    let rawHtm = '<grow><gcel class="inactive"></gcel><gcel class="icon"></gcel></grow>';
                    let ovrlay = Create( "grid", {class:"handle afloat"}, rawHtm );
                    let holder = ovrlay.select( ".icon" );
                    let hidden = ( extras.hidden || "" );
                    let render = ( extras.render || {} );
                    let merged = Object.assign( render, this );

                    Object.keys( merged ).map(( action )=>
                    {
                        let callee = merged[action] ;

                        if ( (typeof callee) !== "function" )
                        { return }; // not interested

                        let button = Create( "div" );
                        let parted = this.family[ action ].split(",");
                        let family = parted[0];
                        let target = entity.detail.target;
                        let handle = extras[action];
                        let finish = ( extras.finish || (function (){}) );

                        button.assign( { refer: entity, intake, target, parent:ovrlay, family:this.family, handle, finish } );
                        button.aspect( { class: `button ${action} ${family}`, title:action } );
                        button.listen( { click: callee } );

                        if ( button.relate(hidden) )
                        { button.enclan("hidden") };

                        if ( action === "status" )
                        {
                            button.
                            toggle
                            ({
                                [`normal = ${parted[0]} normal`]: function(){},
                                [`repeat = ${parted[1]} repeat`]: function(){},
                                [`ignore = ${parted[2]} ignore`]: function(){},
                            })
                            .listen
                            ({
                                click ()
                                {
                                    this.toggle();
                                    this.refer.declan("normal repeat ignore");
                                    this.refer.enclan( this.title );
                                    this.refer.status = this.title;
                                },
                            });

                            if ( !!entity.status )
                            { button.toggle( entity.status ) }
                            else
                            { entity.status = "normal" };
                        };

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
                    update: "icon-format-border-style shut",
                    retain: "icon-save1",
                    revert: "icon-undo",
                    delete: "icon-trash-alt1",
                    moveUp: "icon-arrow-up1",
                    moveDn: "icon-arrow-down1",
                    status: "icon-volume-medium,icon-loop2,icon-volume-mute2",
                },


                update ( signal )
                {
                    Signal.cancel( signal );
                    this.enclan( "hidden" );

                    let button = this.parentNode.select( ".rename" );

                    button.assign( {title:"update", direct:"update", handle:this.handle} );
                    button.signal( "click" );
                },


                rename ( signal )
                {
                    let family = this.family;

                    Signal.cancel( signal );

                    if ( !!this.relate("shut") )
                    {
                        this.reclan( { "shut":"open", "hidden":"", [family.rename]:family.retain } );
                        this.parent.enclan( "busy" );
                        this.refer.select( "grid" ).declan( "inactive" );
                        this.intake.aspect( {readonly:null} );
                        Player.awaits(()=>{ this.intake.setSelectionRange(0,0);  this.intake.focus() },365);
                        return;
                    };


                    this.reclan( { "open":"shut", [family.retain]:family.rename } );
                    this.parent.declan( "busy" );
                    this.refer.select( "grid" ).enclan( "inactive" );
                    this.intake.aspect( {readonly:true} );


                    if ( !!this.direct && !!this.handle )
                    {
                        let detail = this.intake.value.trim();
                        this.handle( this.target, detail );
                        return this.finish( this.direct, this.target, detail, this.refer.detail );
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

                    if ( this.refer.detail.failed )
                    {
                        delete this.refer.detail.failed;
                        this.refer.declan( "fail" );
                        Player.invoke( "pick", this.refer );
                    };

                    this.finish( "rename", origin, target, this.refer.detail );
                },


                revert ( signal )
                {
                },


                delete ( signal )
                {
                    signal.stopImmediatePropagation();
                    signal.stopPropagation();
                    signal.preventDefault();

                    let target = this.target;
                    let entity = this.refer;
                    let detail = entity.detail;

                    Remove( entity );
                    Select( "#savePlaylist" ).enclan( "remind" );

                    try
                    {
                        if ( !!this.handle )
                        { this.handle( origin, target ) }
                        else
                        {
                            if ( confirm( "Deleting: " + target + "\n\n" + "Are you sure?" ) )
                            {
                                if ( detail.folder )
                                { Disk.rmSync(target,{force:true,recursive:true}) }
                                else
                                { Disk.unlinkSync(target) };
                            };

                        };
                    }
                    catch ( failed )
                    { return alert(failed) };

                    this.finish( "delete", target, null, entity.detail );
                },
            }),



            import ( target, indent=0 )
            {
                target = (target+"");

                if ( target.startsWith("./") )
                { target = ( ( __dirname ).split("/").slice(0,-2).join("/") + target.slice(1) ) }
                else if ( !target.includes("/") )
                { target = Player.preset.locate( target, target ) };

                let exists = Disk.existsSync( target );
                let naming = String.filter( target.split("/").pop().split(".").slice(0,-1).join(".") );

                let miming =  Player.origin.miming;
                let holder = { files:[], folds:[] };
                let result = {}, detail={}, signal={}, folder=false, linked, source, ending;

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
                    if ( aspect.startsWith(".") )
                    { return }; // ignore hidden

                    ending = aspect.split(".").pop();
                    source = (`${target}/${aspect}`).split("//").join("/"); // absolute path to current item
                    exists = Disk.lstatSync( source );
                    linked = exists.isSymbolicLink();

                    if ( linked )
                    {
                        source = Disk.readlinkSync( source );

                        if ( Disk.existsSync(source) )
                        { exists = Disk.lstatSync(source) }
                        else
                        { return dump("ignoring broken link: "+source) };
                    };

                    folder = exists.isDirectory();

                    if ( !miming.includes(ending) && !folder )
                    { return }; // not interested

                    holder[ ( folder ? "folds" : "files" ) ].push( aspect );
                });


                holder.folds.sort();
                holder.files.sort();

                result.folder = [ ...holder.folds, ...holder.files ];

                result.folder.map(( aspect )=>
                {
                    source = (`${target}/${aspect}`).split("//").join("/"); // absolute path to current item
                    naming = String.filter( aspect.includes(".") ? aspect.split(".").slice(0,-1).join(".") : aspect );
                    exists = Disk.lstatSync( source );

                    if ( exists.isSymbolicLink() )
                    {
                        source = Disk.readlinkSync( source );

                        if ( Disk.existsSync(source) )
                        { exists = Disk.lstatSync(source) }
                        else
                        { return dump("ignoring broken link: "+source) };
                    };

                    folder = exists.isDirectory();
                    result.detail[aspect] = { naming, folder, indent:(indent+1), target:source, detail:{} };
                });


                return result;
            },



            origin: Handle( "#folderPath" )
            .entrap
            ({
                miming: Config( "miming" ),


                starts ()
                {
                    Player.origin.detail = Config( "origin", {origin:Player.origin.detail} );
                    Select( "#menuList" ).parentNode.style.height = ( Select( "#menuList" ).parentNode.offsetHeight + "px" );
                    Select( "#menuList" ).declan("hidden");
                },


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



                tunnel ( intake, dejavu=false, levels=3 )
                {
                    let ending, parted, target, exists, linked, folder, isFile, object;
                    let output = [];

                    // dump("search:", intake);

                    Disk.readdirSync( intake ).map(( naming )=>
                    {
                        if ( naming.startsWith(".") )
                        { return }; // ignore hidden

                        target = (`${intake}/${naming}`).split("//").join("/");
                        parted = naming.split(".");
                        naming = String.filter( parted.slice(0,-1).join(".") );
                        ending = parted.pop();
                        exists = Disk.lstatSync( target );
                        linked = exists.isSymbolicLink(); // boolean for if it's a short-cut

                        if ( linked )
                        {
                            target = Disk.readlinkSync( target );

                            if ( (target==="/") || target.startsWith(".") || !Disk.existsSync(target) )
                            { return };

                            exists = Disk.lstatSync( target );
                        };


                        if ( target.includes("/.") || target.startsWith("/srv/") )
                        { return };


                        folder = exists.isDirectory();
                        isFile = exists.isFile();
                        object = Player.preset.primed( Player.preset.cached[naming] || { naming, target } );

                        if ( (!folder && !isFile) || (isFile && !Player.origin.miming.includes(ending)) || (levels < 1) )
                        { return }; // not interesting

                        if ( !folder )
                        {
                            Player.preset.cached[ naming ] = object;
                            return output.push(object);
                        };

                        this.tunnel( target, true, (levels-1) ).map(( record )=>
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



            preset: Handle( "#filterPlaylist" )
            .entrap
            ({
                chosen: "sample",
                joiner: " :: ",
                active: "?",
                prefix: "./player/memory/prefix.list",
                cached: Config( "*", "./player/memory/cached.json" ),
                memory: {},


                starts ()
                {
                    document.listen
                    ({
                        keydown ( signal )
                        {
                            if ( (signal.key !== "Escape") || !Player.ovrlay || !signal.target.differ(Player.preset.entity) )
                            { return };

                            Remove( ["*.handle.afloat","#focusLayer","*.scrollBox.afloat.ontop"] );
                            Player.ovrlay = false;
                        },


                        mousedown ( signal )
                        {
                            let target = signal.target;

                            if ( !target.belong(".scrollBox.afloat.ontop") && (Player.ovrlay || target.differ(Player.preset.entity)) )
                            {
                                Remove( ["#focusLayer","*.scrollBox.afloat.ontop"] );

                                if ( target.differ(Player.gadget.entity.select(".icon-cog1.button")) )
                                { Player.ovrlay = false };
                            };
                        },
                    });


                    let preset = Player.preset;


                    if ( !preset.locate(Config("preset")) )
                    {
                        preset.update( true );
                        preset.chosen = ( Object.keys(preset.memory)[0] || preset.chosen );

                        if ( !preset.locate(preset.chosen) )
                        { preset.retain() };

                        Config( {preset: (preset.chosen + preset.joiner + preset.active)} );
                    };


                    Select( "#savePlaylist" ).toggle
                    ({
                        "save to current playlist = icon-document-save normal": function (){},
                        "new playlist from search = icon-document-save-as saveAs": function (){},
                    })
                    .listen
                    ({
                        click ()
                        {
                            Player.preset.retain()
                        },
                    });


                    preset.detail = Config( "preset", {preset: (preset.chosen + preset.joiner + preset.active) } );

                    if ( preset.active !== "?" )
                    {
                        setTimeout(()=>
                        {
                            Player.invoke( "play", Select( "#playList" ).select(`[name*="${preset.active}"]`) );
                        },60);
                    };
                },


                detail:
                {
                    get ( minder )
                    { return minder.chosen },

                    set ( minder, detail )
                    {
                        let parted = ((detail || "") + "").split( minder.joiner );
                        let exists = minder.entity.placeholder;

                        minder.chosen = ( parted[0] || "sample" );
                        minder.active = ( parted[1] || "?" );

                        let preset = ( minder.chosen + minder.joiner + minder.active );

                        if ( (preset !== exists) && (minder.active !== "?") )
                        { Config({preset}) };

                        return minder.update( );
                    },
                },


                locate ( source, backup )
                {
                    source = ( source || backup || Player.preset.chosen || "" ).split( Player.preset.joiner )[0];

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
                    let saveAs = false;

                    if ( Player.preset.entity.value.length > 0 )
                    {
                        saveAs = Player.preset.entity.value;
                        source = saveAs;
                        detail = Select("#playList").select("*.playListItem","!hidden").map(( entity )=>
                        { return entity.detail });
                    }
                    else
                    {
                        source = ( source || Player.preset.detail );
                    };


                    if ( !Array.isArray(detail) )
                    {
                        detail = Select("#playList").select("*.playListItem").map(( entity )=>
                        { return entity.detail });
                    };

                    this.memory[ source ] = detail;
                    Disk.writeFileSync( this.locate(source,source), JSON.stringify(detail,null,4) );

                    if ( !!saveAs )
                    {
                        Player.preset.detail = saveAs;
                    };

                    Select( "#savePlaylist" ).toggle( "save" );
                    Select( "#savePlaylist" ).declan( "remind" );
                })
                .entrap
                ({
                    entity: Select( "#savePlaylist" ),
                }),


                vacuum: Handle( function vacuum ( memory=false )
                {
                    let number = 0;

                    Select( "#playList" ).select( "*.playListItem" ).map(( entity )=>
                    {
                        entity.className = "playListItem hidden";
                        number ++;
                    });

                    if ( !memory )
                    { return };

                    Player.preset.entity.value = "";
                    Select( "#playList" ).innerHTML = ""; // removes all playItems

                    if ( number > 0 )
                    { Select("#savePlaylist").enclan("remind") };

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

                    if ( choice === null )
                    { return (this.entity.value = "") };

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
                                    hidden: (( (this.intake.placeholder === this.custom) ? "button" : "revert" ) + " update"),

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

                                    exists.signal( "click" );
                                    this.intake.setSelectionRange(0,0);
                                    this.intake.focus();
                                    setTimeout( ()=>{ this.intake.focus() }, 250 );
                                    setTimeout( ()=>{ this.intake.focus() }, 500 ); // stoooopid hack yes, but works .. for now
                                    return;
                                };

                                Player.preset.detail = this.intake.value;
                                Config( {preset:this.intake.value} );
                                Remove( "*#focusLayer,#presetChoice" );
                            },


                            keydown ( signal )
                            {
                                if ( signal.keyCode === 13 )
                                {
                                    Signal.cancel( signal );
                                    this.select( '[title="rename"]' ).signal( "click" );
                                    setTimeout(()=>
                                    {
                                        this.signal( "click" );
                                    },250);
                                    Remove( "*#focusLayer,#presetChoice" );
                                };
                            },
                        });


                        option.assign
                        ({
                            custom,
                            detail: { naming:string, target:this.locate(string,string) },
                            intake: option.select( ".text.name" ),

                            forget ()
                            {
                                dump("forget: ",this.detail.naming);
                            }
                        });


                        if ( string === custom )
                        {
                            option.enclan( "formBox" );
                            option.intake.assign( { value:"", placeholder:custom } );
                            option.intake.listen
                            ({
                                // blur ()
                                // {
                                //     setTimeout(()=>
                                //     {
                                //         Player.preset.detail = this.value;
                                //         Config( {preset:this.value} );
                                //         Remove( "*#focusLayer,#presetChoice" );
                                //     },250)
                                // },
                            });
                        }


                        grower.append( option );
                    });


                    Select( "#playList" ).parentNode.append( veneer );
                    Select( "#presetHolder" ).append( holder.append(grower) );
                },



                primed ( detail )
                {
                    let seeker = 0,  deadAt,  rating,  failed = false;
                    let output = { naming:"", target:"", length:0, deadAt, rating, seeker, failed, ignore:{}, volume:{} };
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



            gadget: Handle( function gadget ( intake )
            {
                if ( (typeof intake) === "string" )
                { return Select("video."+intake) };
            })
            .entrap
            ({
                entity: Select( "#viewControls" ),


                starts ( gadget )
                {
                    let medias = Select( "*video" );
                        gadget = Player.gadget;

                    medias[0].sister = medias[1];
                    medias[1].sister = medias[0];


                    medias.map(( entity )=>
                    {
                        entity.fadeTo = function fadeTo ( target )
                        {
                            let change = 0.01;
                            let volume = Player.gadget.volume;
                            let milsec = ( (volume.fading * 1000) / 100 );
                            let maxVol = volume.detail;
                            let minVol = 0;
                            let dejavu = false;

                            if ( !!target )
                            {
                                // this.sister.fadeTo("");
                                this.reclan( "free", "busy" );
                                this.volume = 0; // making sure, but should be 0 from fade-out
                                this.style.opacity = 0;
                                this.src = target; // new target !!!
                                try { this.play() }
                                catch ( failed ){ dump(failed+"") };
                            }
                            else
                            {
                                this.reclan( "busy", "free" );
                                this.style.opacity = 1;
                                // dump( this.sister.currentTime );
                            };


                            let timing = setInterval(()=>
                            {
                                if ( !target )
                                {
                                    if ( !this.relate("free") )
                                    {
                                        return clearInterval( timing ); // fading out was interrupted
                                    };

                                    maxVol -= change;
                                    this.volume = maxVol;

                                    if (maxVol <= change)
                                    {
                                        clearInterval( timing );
                                        this.volume = 0;
                                        this.src = "";
                                        delete this.fading;
                                    }

                                    return;
                                };


                                if ( !this.relate("busy") )
                                {
                                    return clearInterval( timing ); // fading in was interrupted
                                };


                                minVol += change;

                                if ( minVol >= maxVol )
                                {
                                    clearInterval( timing );
                                    this.volume = maxVol;
                                    this.style.opacity = 1;
                                    delete this.fading;
                                    return;
                                };

                                this.volume = minVol;
                                this.style.opacity = minVol;

                            }, milsec );
                        }
                        .bind( entity );


                        entity.listen
                        ({
                            play (){ Select("#playButton").toggle("wait") },
                            pause (){ Select("#playButton").toggle("play") },
                            canplaythrough()
                            {
                                if ( Player.started )
                                { return };

                                Player.started = true;
                                this.pause();
                            }
                        });
                    });


                    let holder = Select( "#volumeKnob" );
                    let number = 100,  quatro=0,  naming,  family,  entity;
                    let lining = [ "hardline", "hardline", "softline", "softline" ];
                    let keeper = Config( "seeker" ).autoSaveTime.split(",").map(( detail )=>{ return (detail * 1) });

                    gadget.entity.keeper = { exceed:keeper[0], starts:keeper[1], update:keeper[2], timing:0 };
                    keeper = gadget.entity.keeper;


                    while ( number > 0 )
                    {
                        naming = ( number / 100 ).toFixed(2);
                        family = lining[ quatro ];
                        number = ( number - 1 );
                        quatro = ( (quatro < 3) ? (quatro + 1) : 0 );
                        entity = Create( "div", {name:naming,class:"volbar "+family} );

                        holder.append( entity );
                    };


                    gadget.volume.detail = Config( "volume" );
                    gadget.seeker.canvas.assign( {width:1000, height:100} );


                    Player.gadget.seeker.update();
                    // window.addEventListener( "resize", ()=>{ Player.gadget.seeker.update() } );


                    window.listen
                    ({
                        resize ()
                        {
                            Player.gadget.seeker.update();
                            Player.revive( "viewing" );
                        },


                        // keyup ( signal )
                        // {
                        //     if ( (signal.key === "Control"), (Select("#viewMode").title === "viewing") )
                        //     { Select( "#mainDeck" ).enclan("hidden") };
                        // },


                        keydown ( signal )
                        {
                            let handle = ( signal.ctrlKey );
                            let button = signal.code;
                            let target = signal.target;
                            let entity = target.tagName;

                            if ( (entity === "INPUT") || (handle && ("KeyR,KeyI").includes(button)) || button.startsWith("F") )
                            { return Player.revive("viewing") }; // disable player-keyboard-controls during user input

                            Signal.cancel( signal );


                            if ( !handle )
                            {
                                if ( ("Space,Enter").includes(button) )
                                { return Select("#playButton").signal("click") };

                                if ( ("ArrowLeft,ArrowRight").includes(button) )
                                { return Player.gadget.seeker.detail += ((button === "ArrowRight") ? 3 : -3) };

                                return; // the rest below is for "handle" ... if Ctrl (or Shift) was held
                            };


                            if ( ("Enter,Return").includes(button) )
                            {
                                return Select("#viewMode").signal("click");
                            };


                            if ( ("ArrowUp,ArrowDown").includes(button) )
                            {
                                Player.gadget.volume.detail += ( (button === "ArrowUp") ? 0.1 : -0.1 );
                                return;
                            };


                            if ( ("ArrowLeft,ArrowRight").includes(button) )
                            {
                                return Select( (button === "ArrowLeft") ? "#playPrev" : "#playNext" ).signal( "click" );
                            };

                            Player.revive( "viewing" );
                        },


                        mousedown ()
                        {
                            Player.revive( "viewing" );
                        },


                        mousemove ()
                        {
                            Player.revive( "viewing" );
                        },


                        wheel ()
                        {
                            Player.revive( "viewing" );
                        },
                    });


                    this.entity.select( ".icon-loop.button" )
                    .toggle
                    ({
                        "repeat entire playlist = icon-loop": function (){},
                        "finish entire playlist = icon-angle-double-right": function (){},
                        "random playlist tracks = icon-shuffle": function (){},
                    })
                    .listen
                    ({
                        click ( signal )
                        {
                            this.detail = this.title.split(" ")[0];

                            if ( signal.detail.toggle === false )
                            { return };

                            this.toggle();
                            this.detail = this.toggleStatus.split(" ")[0];

                            Config( {seeker: Object.assign(Config("seeker"),{playListMode:this.detail}) } );
                        },
                    })
                    .toggle( Config("seeker").playListMode )
                    .signal( "click", {toggle:false} )


                    Select( "#playButton" ).toggle
                    ({
                        "play icon-play1": function ()
                        {
                            let active = Select("video.busy");

                            this.toggle("wait");

                            if ( (Select("#playList").childNodes.length > 0) && !active )
                            {
                                return Player.invoke("play", Select("#playList").childNodes[0]);
                            };

                            try { active.play() }
                            catch ( failed ){ dump(failed+""); };
                        },

                        "wait icon-pause1": function ()
                        {
                            let active = Select("video.busy");

                            active.pause();
                            this.toggle("play");
                        },
                    });


                    this.entity.select( "#viewMode" ).toggle
                    ({
                        "browsing = icon-expand": function ()
                        {
                            // this.toggle();
                            Select( "#mainDeck" ).enclan( "autoHide" );
                            Select( "#mainDeck" ).enclan( "hidden" );
                        },

                        "viewing = icon-compress": function ()
                        {
                            // this.toggle();
                            Select( "#mainDeck" ).declan( "autoHide" );
                            Select( "#mainDeck" ).declan( "hidden" );
                        },
                    })
                    .listen
                    ({
                        click ()
                        {
                            this.toggle();
                            Player.revive( "viewing" );
                            Player.gadget.seeker.update();
                        }
                    });


                    this.entity.select( ".icon-cog1.button" ).listen
                    ({
                        click ( signal )
                        {
                            if ( Player.ovrlay )
                            { return Player.ovrlay = false };

                            Player.ovrlay = true;

                            // Remove("#configLayout,#focusLayer");

                            let memory = Config( "*" ),  detail,  values,  option, intake;
                            let config = { player:{} };
                            let veneer = Create( "div", {id:"focusLayer"} );
                            let enwrap = Create( "div", {id:"configLayout", class:"scrollBox afloat ontop"} );
                            let parent = Create( "grid", {}, '<grow><gcel id="configHolder" class="enwrap"></gcel></grow>' );
                            let holder = parent.select( "#configHolder" );

                            Object.keys( memory ).map(( aspect )=>
                            {
                                detail = memory[ aspect ];

                                if ( (typeof detail) !== "object" )
                                { config.player[aspect] = detail  }
                                else
                                { config[ aspect ] = detail };
                            });

                            Object.keys( config ).map(( header, number )=>
                            {
                                holder.append( Create("h1",{id:(header+"Config")},header) );
                                values = config[ header ];

                                Object.keys( values ).map(( aspect )=>
                                {
                                    option = Player.create( "playItem",
                                    {
                                        ".text.name": ( aspect + "" ),
                                        ".text.from": values[ aspect ],

                                        mousemove ( signal )
                                        {
                                            Player.handle( this, signal,
                                            {
                                                hidden: "delete rename",

                                                update ( aspect, detail )
                                                {
                                                    let parted = aspect.split(".");
                                                    let update = Config("*");

                                                    if ( parted[0] === "player" )
                                                    { update[ parted[1] ] = detail }
                                                    else
                                                    { update[ parted[0] ][ parted[1] ] = detail };

                                                    Config( update );
                                                },
                                            });
                                        },
                                    });


                                    option.assign( {detail:{naming:aspect,target:(header+"."+aspect)}} );
                                    option.remove( ".time" );
                                    option.enclan( "formBox" );
                                    option.select( ".playItemCell.name" ).style.width = (((header==="player" )?55:100) + "px");

                                    if ( number < 1 )
                                    { holder.select("h1").style.marginTop = "14px" };

                                    holder.append( option );
                                });
                            });

                            Select( "#menuList" ).parentNode.append( veneer );
                            Select( "#menuList" ).parentNode.append( enwrap.append(parent) );
                        },
                    });


                    this.entity.select( "#playPrev" ).listen
                    ({
                        click ()
                        {
                            Player.invoke(()=>
                            {
                                let holder = Select("#playList");
                                let target = ( holder.select(".playListItem.active") || holder.select(".playListItem") );
                                let sister = ( !target ? null : (target.previousSibling || holder.lastChild) );

                                if ( !!sister )
                                {
                                    Player.invoke( "play", sister );
                                };
                            },1728);
                        },
                    });


                    this.entity.select( "#playNext" ).listen
                    ({
                        click ()
                        {
                            Player.invoke(()=>
                            {
                                Player.invoke( "play", Player.gadget.upNext );
                            },1728);
                        },
                    });


                    Player.listen
                    ({
                        mouseup ()
                        {
                            Player.gadget.widget = null;
                        },

                        mousemove ( signal )
                        {
                            let target = signal.target;

                            // if ( !target.relate("lBox","rBox","deck","knob") )
                            // {
                            //     Remove("#seekTime");
                            // };
                        },
                    });


                    this.timing = setInterval(()=>
                    {
                        let exists = Select( "video.busy" );
                        let active = gadget.active;

                        if ( !exists || !active || !active.detail )
                        { return }; // nothing to do

                        let entity = Select( "#playList" ).select(`[name="${active.detail.naming}"]`);

                        if ( !entity )
                        { return }; // nothing to do

                        entity.reclan("active","active");
                        exists.style.background = ( !exists.getVideoPlaybackQuality().totalVideoFrames ? "transparent" : "black" );

                        let deadAt = ( active.detail.deadAt || exists.duration );
                        let number = ( exists.currentTime / exists.duration );
                        let fadeAt = ( deadAt - this.volume.fading );
                        let milsec = ( new Date ).getTime();
                        let timing = Math.trunc( milsec / 1000 );
                        // let status = ( Select("#seekTime") || {} );
                        let saveAs = Select("#savePlaylist");

                        if ( (Player.preset.entity.value === "") && saveAs.relate("saveAs") )
                        { saveAs.toggle() };

                        // if ( (milsec - status.timing) > 900 )
                        // { Remove(status); };

                        if ( gadget.seeker.number === number )
                        { return }; // nothing to do

                        let ignore = gadget.active.relate("ignore");

                        gadget.seeker.number = number;
                        gadget.seeker.button.style.width = ( (number * 100) + "%" );
                        // gadget.seeker.signal( "mousemove", {x:number} );

                        if ( ignore || ((fadeAt > 0) && (exists.currentTime >= fadeAt) && !exists.fading) )
                        { return Player.invoke("play",this.upNext) }; // ignored

                        if ( (exists.duration >= keeper.exceed) && (exists.currentTime >= keeper.starts) )
                        {
                            if ( (timing - keeper.timing) >= keeper.update  )
                            {
                                keeper.timing = timing;
                                entity.detail.seeker = exists.currentTime;
                                Player.preset.retain();
                                entity = null;
                            };
                        };
                    },100);

                },


                volume: Handle( "#volumeKnob" )
                .entrap
                ({
                    number: Config( "volume" ),
                    unused: "hsla(0,0%,50%,0.1)",
                    occupy: "hsla(H,S%,50%,A)",
                    fading: Config( "fading" ),


                    detail:
                    {
                        get ( minder )
                        { return minder.number },

                        set ( minder, detail )
                        {
                            minder.number = detail;
                            return minder.update();
                        },
                    },


                    update ()
                    {
                        this.number = ( (this.number < 0) ? 0 : ((this.number > 1) ? 1 : this.number) );

                        this.entity.select("*").map(( entity )=>
                        {
                            let detail = this.unused;
                            let hidden = "";
                            let number = ( entity.aspect("name") * 1 );
                            let differ = (100 - (number * 100));
                            let change = { H: (differ+""),  S: ((100 - differ)+""), A:0.7 };

                            if ( this.number >= number )
                            {
                                detail = this.occupy;
                                hidden = detail.split("H").join(change.H).split("S").join(change.S).split("A").join("0.3");
                                detail = detail.split("H").join(change.H).split("S").join(change.S).split("A").join(change.A);
                                entity.style.boxShadow = `0px 0px 7px ${hidden}`;
                            }
                            else
                            {
                                entity.style.boxShadow = `unset`;
                            };

                            entity.style.background = detail;
                        });

                        Select("*video").map(( entity )=>
                        { entity.volume = this.number });

                        // if ( !!exists )
                        // { exists.volume = this.number };


                        Player.awaits(()=>
                        {
                            Config({volume:this.number});
                        },250);
                    },
                })
                .listen
                ({
                    mousedown ( signal )
                    {
                        Player.gadget.widget = this;
                        Player.gadget.volume.detail = ( signal.target.aspect("name") * 1 );
                    },

                    wheel ( signal )
                    {
                        let moving = ( (signal.deltaY / 10) / 100 );
                        Player.gadget.volume.detail = ( (this.minder.number - moving).toFixed(2)  * 1 );
                    },

                    mousemove ( signal )
                    {
                        if ( ((Player.gadget.widget||{}).id !== this.id) || (signal.buttons !== 1) )
                        { return };

                        Player.gadget.volume.detail = ( signal.target.aspect("name") * 1 );
                    },
                }),


                seeker: Handle( "#seekerFace" )
                .entrap
                ({
                    button: Select( "#seekerKnob" ),
                    shadow: Select( "#seekerDeck" ),

                    number: 0,
                    spacer: 7,


                    detail:
                    {
                        get ( minder )
                        { return minder.number },

                        set ( minder, detail )
                        {
                            if ( (detail > 1) || (detail < -1) )
                            {
                                let length = Select("video.busy").duration;
                                detail = ( ((length * minder.number) + detail) / length );
                            };

                            detail = ( (detail < 0) ? 0 : ((detail > 1) ? 1 : detail) );

                            minder.number = detail;
                            return minder.update( "seek" );
                        },
                    },


                    canvas: Select( "#seekerDraw" ).listen
                    ({
                        finish ( signal )
                        {
                            Player.gadget.seeker.update( signal.detail );
                        },
                    }),


                    update ( detail )
                    {
                        let active, number;

                        if ( detail === "seek" )
                        {
                            this.button.style.width = ( (this.number * 100) + "%" );
                            active = Select( "video.busy" );
                            number = ( (active.duration * this.number) || 0 );
                            active.currentTime = number;
                            return;
                        }
                        else
                        {
                            this.button.style.width = "0px";
                        };


                        active = Player.gadget.active;


                        if ( !!detail && !!detail.deadAt && !active.detail.deadAt && (detail.deadAt !== active.detail.deadAt) )
                        {
                            active.detail.deadAt = detail.deadAt;
                            Player.preset.retain();
                        };


                        let hashed = ( detail || "" ).hashed;
                        let source = ( !detail ? this.shadow.select("img").src : detail.target );

                        // Player.gadget.seeker.signal( "mousemove", {x:0} );

                        Player.revive(()=>
                        {
                            let spread = ( Select("#seekerCell").offsetWidth + "px" );

                            this.shadow.select("img").assign({ src:source, style:`width:${spread}` });
                            this.button.select("img").assign({ src:source, style:`width:${spread}` });
                        });
                    },


                    render ( detail, forced )
                    {
                        let folder = "../memory/seeker.wave";
                        let length = Math.trunc( detail.length ),  number;
                        let memory = Disk.readdirSync( "./player/memory/seeker.wave" );
                        let dejavu = memory.indexOf( (this.shadow.src||"").split("/").pop() );

                        do { number = ( !memory.length ? 0 : Number.random(memory.length-1) ) }
                        while ( (memory.length > 0) && (number === dejavu) );

                        let random = ( !memory[number] ? "./assets.dir/images/sample.png" : (folder + "/" + memory[number]) );
                        let source = detail.target;
                        let hashed = Hash( source );
                        let target = ( folder + "/" + hashed + ".png" );
                        let exists = Disk.existsSync( "./player/memory/seeker.wave/" + hashed + ".png" );
                        let config = Config( "seeker" );
                        let sample = config.maxSampleNum;
                        let timing = ( new Date() ).getTime(),  faking;


                        if ( length >= config.autoWaveTime )
                        {
                            target = random;
                            exists = true;
                        };


                        detail = { hashed, length, sample, target, timing };
                        faking = Object.assign( {}, detail );

                        this.update( Object.assign(faking,{target:random}) );


                        if ( exists && !forced )
                        {
                            detail.timing = 0;
                            return this.canvas.signal( "finish", detail );
                        };


                        if ( !!this.canvas.worker )
                        { this.canvas.worker.cancel() };


                        this.canvas.worker = new WaveForm( source, this.canvas, sample, 100 ).listen
                        ({
                            finish ()
                            {
                                detail.timing = ( ((new Date()).getTime() - detail.timing) / 1000 );
                                detail.binary = this.output.src.split(";base64,").pop();

                                Disk.writeFile( ("./player/"+detail.target.slice(2)), detail.binary, "base64", ( failed )=>
                                {
                                    if ( failed )
                                    { return alert(failed) };


                                    detail.deadAt = ( detail.length * (this.deadAt||1) );
                                    this.canvas.signal( "finish", detail );
                                });
                            },
                        });

                        // this.canvas.worker.listen
                        // ({
                        //     decode ()
                        //     {
                        //         dump("test");
                        //     },
                        // });

                    },
                })
                .listen
                ({
                    mousedown ( signal )
                    {
                        Player.gadget.widget = this;

                        let spacer = this.minder.spacer;
                        let offset = { left:this.offsetLeft, span:this.offsetWidth };
                        let mouseX = signal.x;
                        let number = ( (((mouseX - spacer) - offset.left) / offset.span).toFixed(6) * 1 );

                        Player.gadget.seeker.detail = number;
                        // Player.gadget( "busy" ).play();
                    },

                    mousemove ( signal )
                    {
                        let device = Player.gadget( "busy" );
                        let entity = Player.gadget.seeker.entity;
                        let seeker = Select( "#seekTime" );
                        let spacer = this.minder.spacer;
                        let offset = { left:this.offsetLeft, span:this.offsetWidth };
                        let mouseX = Math.trunc( signal.x || (((signal.detail.x * offset.span) + spacer) + offset.left) );
                        let number = ( (((mouseX - spacer) - offset.left) / offset.span).toFixed(6) * 1 );
                        let string = Player.timing( device.duration * number );
                        let timing = ( new Date ).getTime();

                        if ( isNaN(mouseX) )
                        { return };


                        // if ( !!seeker )
                        // {
                        //     Remove(seeker);
                        //     seeker = null;
                        // }

                        if ( !seeker )
                        {
                            seeker = Create( "lining", {id:"seekTime", class:"" } ).assign({timing});
                            seeker.append( Create("div", {class:"lBox"}) );
                            seeker.append( Create("div", {class:"rBox vanish"}) );
                            entity.append( seeker );
                        };


                        offset.pixl = Math.trunc(offset.span * number);

                        seeker.style.left = ( (offset.pixl - 50) + "px" );
                        seeker.select(".lBox").innerHTML = string;
                        seeker.select(".rBox").innerHTML = string;

                        if ( offset.pixl < 50 )
                        {
                            seeker.select(".lBox").enclan("vanish");
                            seeker.select(".rBox").declan("vanish");
                        }
                        else
                        {
                            seeker.select(".lBox").declan("vanish");
                            seeker.select(".rBox").enclan("vanish");
                        };

                        if ( ((Player.gadget.widget||{}).id !== this.id) || (signal.buttons !== 1) )
                        { return };

                        Player.gadget.seeker.detail = number;
                    },

                    wheel ( signal )
                    {
                        if ( !signal.shiftKey )
                        { return };

                        let number = ( this.minder.number + ((signal.deltaY/1000)/10) );
                        Player.gadget.seeker.detail = number;
                    },

                    dragstart ( signal )
                    {
                        Signal.cancel( signal );
                        return false;
                    },
                }),
            }),



            invoke: function invoke ( action, entity, option, detain=1 )
            {
                if ( ((typeof action) === "function") && ((typeof entity) === "number") )
                {
                    let timing = entity;
                    let hashed = Hash( action );

                    if ( !!Player.invoke[hashed] )
                    { return dump("invoke ignored .. cooling down") };

                    Player.invoke[ hashed ] = setTimeout( ()=>{ delete Player.invoke[hashed] }, timing );

                    return { timing:Player.invoke[hashed], result:action() };
                };


                // Player.awaits(()=>
                // {
                //     // clearTimeout( Player.awaits.timing ); // ignore 2nd single click upon dblclick
                    this[ action ]( entity, option );
                // }, detain);
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
                            if ( !this.parent || !this.parent.buffer)
                            { return };

                            this.parent.detail.length = this.parent.buffer.duration;
                            Player.preset.cached[ this.parent.detail.naming ] = this.parent.detail;
                            this.parent.select( ".text.time" ).value = Player.timing( this.parent.detail.length );

                            this.src = ""; // stop loading this item's media source
                            delete this.parent.buffer; // free the DOM (memory) from this media element
                            this.parent.settle();
                        },
                    });
                },


                play ( entity )
                {
                    if ( !entity || !entity.detail )
                    {
                        return Select("#playButton").toggle("play");
                    };

                    entity = Select( "#playList" ).select(`[name="${entity.detail.naming}"]`); // refresh stale memory


                    let detail = entity.detail;
                    let target = detail.target;
                    let device = { busy:Player.gadget("busy"), free:Player.gadget("free") };
                    let button = Select( "#playButton" );
                    let string = ( Player.preset.chosen + Player.preset.joiner + detail.naming );
                    let exists = Select( "#playList" ).select( ".playListItem.active" );
                    let status = ( Select( "#listOption" ).detail || "normal");
                    let listed = Select( "#playList" ).select( "*.playListItem", "!hidden ignore" );
                    let random = Number.random( listed.length );
                    let number = ( ()=>{ for (let i=0; i<listed.length; i++ ){ if(listed[i]===entity){ return i }} } )();
                    let upNext = ( listed[ (number+1) ] || entity.nextSibling );
                    let gadget = Player.gadget;
                    let differ;


                    if ( entity.status === "repeat" )
                    {
                        upNext = entity;
                    }
                    else
                    {
                        if ( status !== "normal" )
                        { upNext = ( (status === "repeat") ? (upNext || listed[0]) : listed[random] ) };

                        while ( !!upNext && upNext.relate("ignore") )
                        { upNext = upNext.nextSibling };
                    };


                    if ( entity.relate("ignore") )
                    { return Player.invoke("play",upNext) };


                    Player.render( detail, "coverArt" );

                    Player.gadget.active = entity;
                    Player.gadget.upNext = upNext;


                    button.enclan( "active" );
                    button.toggle( "wait" );
                    Select( "#seekerCell" ).style.pointerEvents = "unset";

                    device.free.fadeTo( target );

                    if ( !!device.busy  )
                    { device.busy.fadeTo("") };

                    if ( !!exists  )
                    { exists.declan("active") };

                    Player.preset.detail = string;
                    button.aspect( {title:string} );

                    void setTimeout(()=>
                    {
                        Player.render( detail, "waveForm" );
                        entity.enclan( "active" );
                        entity.focus();
                        number = ( detail.seeker / detail.length );
                        differ = ( detail.length - detail.seeker );
                        gadget.seeker.detail = ( (differ < 3) ? 0 : number );
                    }, 500);
                },
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
                        let handle = entity.select( ".menuItemLine" );

                        let picker = function picker ( signal )
                        { Player.origin.browse( Object.assign(this.detail,{signal}) ) };

                        let minder = function minder ( signal )
                        {
                            Player.handle( this, signal,
                            {
                                hidden: "revert update",

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

                        entity.select( ".dent" ).style.width = ( (indent*15) + "px" );
                        entity.select( ".menuItemText" ).value = aspect;

                        if ( !detail.folder )
                        {
                            entity.select( ".togl" ).innerHTML = "";
                            entity.select( ".icon i" ).className = "icon-new-audio-alarm";
                            entity.remove( ".menuItemDrop" );
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
                    {
                        if ( Select("#playList").childNodes.length < 1 )
                        { Select( "#savePlaylist" ).declan( "remind" ) };

                        return; // done, or invalid
                    };

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

                        keydown ( signal )
                        {
                            if ( !signal.ctrl )
                            { return };


                        },

                        dragstart ( signal )
                        { Signal.cancel(signal) },

                        dblclick ( signal )
                        { Player.invoke( "play", this, true, 300 ) },


                        mousemove ( signal ){ Player.handle( this, signal,
                        {
                            hidden: "revert update",
                            delete (){}, // override .. soft delete

                            render:
                            {
                                status (){},


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
                            }
                        })},
                    });

                    entity.detail = detail;
                    entity.aspect( {name:naming, "data-from":folder} );

                    Select( "#playList" ).append( entity );
                    return entity;
                },


                coverArt ( detail, parent )
                {
                    let folder = detail.target.split("/").slice(0,-1).join("/");

                    if ( folder.startsWith(".") )
                    { folder = Path.join( __dirname, folder ) };

                    let config = Config( "ornate" );
                    let parted = Config( "ornate" ).coverArtPics.split(".");
                    let search = { naming: parted[0].slice(1,-1).split("|"),  ending: parted[1].slice(1,-1).split("|") };
                    let backup = config.autoCoverArt,  naming,  ending,  locate,  target;

                    search.naming.push( detail.target.split("/").pop().split(".").slice(0,-1).join(".") );
                    search.naming.push( detail.naming );

                    for ( naming of search.naming )
                    {
                        for ( ending of search.ending )
                        {
                            locate = ( folder + "/" + naming + "." + ending );

                            if ( Disk.existsSync(locate) )
                            { target = locate;  break };
                        };

                        if ( !!target )
                        { break };
                    };


                    target = ( target || backup );
                    Select( "#coverArt" ).style.backgroundImage = `url("${target}")`;
                },


                waveForm ( detail, parent )
                {
                    Player.gadget.seeker.render( detail );
                },
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------





// import :: custom : client
// ----------------------------------------------------------------------------------------------------------------------------
    void require( "../custom/script.cjs" );
// ----------------------------------------------------------------------------------------------------------------------------





// invoke :: Player.starts
// ----------------------------------------------------------------------------------------------------------------------------
    void setTimeout( function startsPlayer (){ Player.signal("starts") }, 60 );
// ----------------------------------------------------------------------------------------------------------------------------





/*
*/

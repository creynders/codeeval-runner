#! /usr/bin/env node

'use strict';
var _ = require( 'lodash' );
var fs = require( 'fs' );
var chalk = require( 'chalk' );
var path = require( 'path' );

var opts = require( 'nopt' )( {
    "verbose" : [Boolean],
    "version" : [Boolean]
}, {
    "v" : ["--verbose"]
}, process.argv, 2 );

var config;
try{
    config = JSON.parse( fs.readFileSync( 'codeeval.json' ) );
}catch( err ){
    //suppress, config is optional
}

config = _.merge( {
    "base": "solutions",
    "files" : {
      "output": "<%=base%>/<%=challenge%>/output.txt",
      "input": "<%=base%>/<%=challenge%>/sample.txt",
      "program": "<%=base%>/<%=challenge%>/index.js",
      "expected": "<%=base%>/<%=challenge%>/expected.txt"
    },
    "command":{
      "main" : "node",
      "args" : "<%=program%> <%=input%>"
    }
}, config || {} );

if( !fs.existsSync( config.base ) ){
    return console.log( chalk.bold.red( 'Directory', "'" + config.base + "'", 'does not exist!' ) );
}

var solutions;
if( opts.argv.remain.length > 0 ){
    solutions = [opts.argv.remain[0]];
}else{
    solutions = fs.readdirSync( config.base ).map( function( name ){
        var stats = fs.statSync( path.join( config.base, name ) );
        if( stats.isDirectory() ){
            return name;
        }

        return false;
    } )
}

require( './lib/codeeval-runner' )( solutions, config, opts );

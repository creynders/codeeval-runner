/*
 * 
 * https://github.com/creynders/codeeval-runner
 *
 * Copyright (c) 2014 Camille Reynders
 * Licensed under the MIT license.
 */

'use strict';

var chalk = require( 'chalk' );
var path = require( 'path' );
var _tpl = require( 'underscore-tpl' );
var fs = require( 'fs' );
var spawn = require( 'child_process' ).spawn;
var expect = require( 'must' );
var _ = require( 'lodash' );

function fail(){
    var args = Array.prototype.slice.call( arguments );
    console.log( chalk.bold.red.apply( null, ["\u2718"].concat( args ) ) );
}

function succeed(){
    var args = Array.prototype.slice.call( arguments );
    console.log( chalk.green.apply( null, ["\u2714"].concat( args ) ) );
}

function run( challenge,
              config,
              opts ){
    if( challenge ){
        if( fs.existsSync( config.files.program ) ){
            var out = fs.openSync( config.files.output, 'w' );
            var args = config.command.args.split(" ");
            var process = spawn( config.command.main, args.concat([config.files.program, config.files.input]), {
                stdio : ['ignore', out, out]
            } );

            process.on( 'error', function(){
                console.log( arguments );
            } );

            process.on( 'close', function( code ){
                if( code === 0 ){
                    var test = fs.existsSync( config.files.expected );
                    if( test ){
                        var expected = fs.readFileSync( config.files.expected, { encoding : "UTF-8" } );
                        var actual = fs.readFileSync( config.files.output, { encoding : "UTF-8" } );
                        if( opts.verbose ){
                            console.log( actual );
                        }
                        try{
                            expect( actual.trim() ).to.equal( expected.trim() );
                        }catch( err ){
                            return fail( challenge, err );
                        }
                        return succeed( challenge )
                    }
                }
                return fail( challenge );
            } );
        }else{
            return fail( config.files.program, "file not found!" );
        }
    }
}

module.exports = function( challenges,
                           config,
                           opts ){
    opts = opts || {};
    challenges.forEach( function( challenge ){
        var c = config;
        if( c[challenge] ){
            c = _.merge( c, c[challenge] );
        }

        var files = _tpl( c.files, {
            base      : config.base,
            challenge : challenge
        } );
        var command = _tpl( c.command, files );
        run( challenge, {
            base    : config.base,
            command : command,
            files   : files
        }, opts );
    } );
};

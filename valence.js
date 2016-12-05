/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* global module */

(function (global, factory) {

    'use strict'

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ?
            factory(global, true) :
            (w) => {
                if (!w.document) {
                    throw new Error('Valence requires a window with a document')
                }
                return factory(w)
            }
    } else {
        factory(global)
    }

}(typeof window !== 'undefined' ? window : this, window => {
    'use strict'

    /*
    PLAN
    Make a white pages object with the routing table.
    http://docs.valence.desire2learn.com/http-routingtable.html
    */

    /*Specify option with lp or le with this.api_base_string.  lr seems unnecessary*/


    /*STATIC METHODS*/
    function getCall(call, ver, ou) {
        let directory = {
            whoami: `/d2l/api/lp/${ver}/users/whoami`,
            getFinalGrade: `/d2l/api/le/${ver}/${ou}/grades/values/myGradeValues/`
        }

        return directory[call]
    }

    /*CONSTRUCTOR*/
    function Construct(version, call) {
        this.lib_version = version
        this.api_version = 1.15
        this.call = call
        this.ou = this.getOU()
        this.api_base_string = getCall(this.call, this.api_version, this.ou)
        this.response = {}

        this.fetch()
    }

    /*PROTOTYPE METHODS*/
    Construct.prototype = {
        fetch: function () {

            var httpRequest = new XMLHttpRequest(),
                that = this

            httpRequest.open('GET', this.api_base_string, false)

            httpRequest.onload = function () {
                that.response = JSON.parse(this.responseText)
            }

            httpRequest.onerror = function (e) {
                console.log('Can not retrieve API data', e, httpRequest.statusText)
            }

            httpRequest.setRequestHeader('Content-Type', 'application/json')
            httpRequest.send()

        },
        getOU: function () {
            //Parse the URL and return a string for the OU
            var ou = window.location.pathname.split('/')[4] || window.location.pathname.split('/')[3]
            console.log(ou)
            return ou
        }
    }

    /*WINDOW ATTACHER*/
    window.valence = function (a) {
        let vers = '2.0.0',
            obj = new Construct(vers, a)

        return obj
    }

}))

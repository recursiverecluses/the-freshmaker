/**
 * TheFreshmaker
 * 
 * Auto-reload webpage on server restart.
 * 
 * @author Anthony Bennett <anthonybennett@outlook.com>
 * 
 */
class TheFreshmaker {

    constructor() {

        if (typeof window.freshMaker !== "undefined") {
            this.log("There can be only one freshmaker.")
            return this;
        }

        this.sseUrl = "/the-freshmaker/events"
        this.startTimeUrl = "/the-freshmaker/start-time"
        this.startTime = null
        
        // Create an object for Server Sent Events.
        const sse = new EventSource(this.sseUrl)
        
        // Listen to the start-time event.  Will receive start-time on connect and re-connect.
        sse.addEventListener("start-time", e => {
            const fresh = JSON.parse(e.data)
            this.reloadIfRestarted(fresh.startTime)
        })

        // Query the server on failure for a new start-time.
        // The connection will continually timeout and reconnect. This is fine.
        sse.onerror = e => {
            const url = this.startTimeUrl
            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        this.log(response)
                        throw new Error('There was a problem with the response.')
                    }
                    return response.json()
                })
                .then(eventData => {
                    this.reloadIfRestarted(eventData.startTime)
                })
                .catch((err) => {
                    this.log(`Error fetching ${url}. The server may be restarting.`)
                    this.log(err)
                })
        }

        window.freshMaker = this
    }

    log(msg) {
        console.log(`TheFreshmaker: ${msg}`)
    }

    reloadIfRestarted(startTime) {
        if (typeof startTime !== "number") {
            this.log(`The startTime needs to be a number.`)
        } else if (this.startTime === null) {
            this.startTime = startTime
            this.log("Server started on " + Date(this.startTime))
        } else if (this.startTime !== startTime) {
            this.log("Reloading...")
            location.reload();
        }
    }
}

new TheFreshmaker()



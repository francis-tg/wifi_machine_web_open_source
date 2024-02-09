if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((res) => {
        console.log(res)
        res.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BM5jdgLn5Z8KJdUniQ424CNNG7z4L4HPxebT5x342hiWOhR6AXU1_yH24lh0smd7kIeUzwp8uON6YDS4kD2bGIA'
            })
            .then(() => { console.log("notification push subscribe") })
    })
}
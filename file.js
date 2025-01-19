const file={
	singleLoadHandler:function(event,fn) {
		fn= fn ||  ((e)=>console.log(e.target.result))
        const file = event.target.files[0];
        if (file) {
			const reader = new FileReader()
			reader.onload = fn;
            reader.readAsText(file);
        }
	},
	multipleLoadHandler : function (event, fn) {
		fn = fn || ((e) => console.log(e.target.result));
		const files = event.target.files;
		if (files) {
			const filePromises = Object.keys(files).map(key => {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = (e) => {
						fn(e, files[key]);
						resolve(files[key].name); // Resolve the promise when the file is read
					};
					reader.readAsText(files[key]);
				});
			});

			// Return a promise that resolves when all files are read
			return Promise.all(filePromises);
		}
	}
}
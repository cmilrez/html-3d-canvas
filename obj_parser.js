function parse(data) {
	const lines = data.split('\n')
	let vertices = []
	let faces = []
	for (let i=1; i<lines.length; i++) {
		let line = lines[i]
		
		const comment_id = line.indexOf('#')
		if (comment_id > -1) {
			line = line.substring(0, comment_id)}
		
		//const items = line.replace(/\s+/g, ' ').trim().split(' ')
		const items = line.trim().split(' ')
		switch(items[0].toLowerCase()) {
			case 'v':
				vertices.push(parse_vertices(items))
				break
			case 'f':
				faces.push(parse_faces(items))
				break
		}
	}
	
	return {
		v: vertices,
		f: faces
	}
}

function parse_vertices(items) {
	const x = items.length >= 2 ? parseFloat(items[1]) : 0.0
    const y = items.length >= 3 ? parseFloat(items[2]) : 0.0
    const z = items.length >= 4 ? parseFloat(items[3]) : 0.0
	
	return {x, y, z}
}

function parse_faces(items) {
	let face = []
	if (items.length >= 2) {face.push(parseFloat(items[1])-1)} // vertex id starts at 1
    if (items.length >= 3) {face.push(parseFloat(items[2])-1)}
    if (items.length >= 4) {face.push(parseFloat(items[3])-1)}
		
	return face
}
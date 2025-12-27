fileInput.addEventListener('change', handleFile)
rangeX.oninput = (event) => {dx = parseFloat(event.target.value)}
rangeY.oninput = (event) => {dy = parseFloat(event.target.value)}
rangeZ.oninput = (event) => {dz = parseFloat(event.target.value)}

function handleFile(event) {
	const file = event.target.files[0]
	if (!file) {
		console.log('no file')
		return}
	
	const reader = new FileReader()
	reader.readAsText(file)
	
	reader.onload = () => {
		const data = parse(reader.result)
		vertices = data.v
		faces = data.f
	}
	reader.onerror = () => {
		console.log(reader.error)}
}

const AXIS_X = 'x'
const AXIS_Y = 'y'
const AXIS_Z = 'z'
const FPS = 60
const SCREEN = {x: 800, y: 800}
const BACKGROUND = '#222222'
const COLOR1 = '#0064DC'
const COLOR2 = '#14B4DC'
const ctx = canvas.getContext('2d')
let vertices = [
	{x:  0.25, y:  0.25, z:  0.25},
	{x: -0.25, y:  0.25, z:  0.25},
	{x: -0.25, y: -0.25, z:  0.25},
	{x:  0.25, y: -0.25, z:  0.25},
	{x:  0.25, y:  0.25, z: -0.25},
	{x: -0.25, y:  0.25, z: -0.25},
	{x: -0.25, y: -0.25, z: -0.25},
	{x:  0.25, y: -0.25, z: -0.25}]

let faces = [[0, 1, 2, 3], [4, 5, 6, 7],
			[0, 4], [1, 5], [2, 6], [3, 7]]

function clear() {
	ctx.fillStyle = BACKGROUND
	ctx.fillRect(0, 0, SCREEN.x, SCREEN.y)}

function point({x, y}, size=20) {
	ctx.fillStyle = COLOR1
	ctx.fillRect(x - size/2, y - size/2, size, size)}

function line(p1, p2) {
	ctx.lineWidth = 1
	ctx.strokeStyle = COLOR2
	ctx.beginPath()
	ctx.moveTo(p1.x, p1.y)
	ctx.lineTo(p2.x, p2.y)
	ctx.stroke()}

function normalize(point) {
	return {
		x: ((point.x + 1) / 2) * SCREEN.x,
		y: (1 - (point.y + 1) / 2) * SCREEN.y}}

function project(vector2) {
	return {
		x: vector2.x/vector2.z,
		y: vector2.y/vector2.z}}

function translate({x, y, z}, amount, axis) {
	switch(axis) {
		case AXIS_X:
			return {x: x + amount, y: y, z: z}
			break
		case AXIS_Y:
			return {x: x, y: y + amount, z: z}
			break
		case AXIS_Z:
			return {x: x, y: y, z: z + amount}
			break
		default:
			console.log('invalid axis: ' + axis)}}

function rotate({x, y, z}, angle, axis) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	switch(axis) {
		case AXIS_X:
			return {
				x: x,
				y: y * cos - z * sin,
				z: y * sin + z * cos}
			break
		case AXIS_Y:
			return {
				x: x * cos - z * sin,
				y: y,
				z: x * sin + z * cos}
			break
		case AXIS_Z:
			return {
				x: x * cos + y * sin,
				y: -x * sin + y * cos,
				z: z}
			break
		default:
			console.log('invalid axis: ' + axis)}}

let dx = 0
let dy = 0
let dz = 0.5
let angle_x = 0
let angle_y = 0
let angle_z = 0

function draw() {
	clear()
	const delta = 1 / FPS
	//dz += Math.sin(angle_y) * delta
	//angle_x += -0.75*Math.PI * delta
	angle_y += 0.25*Math.PI * delta
	//angle_z += 0.5*Math.PI * delta
	//for (const v of vertices) {
	//	point(normalize(project(translate(rotate(rotate(rotate(v, angle_y, AXIS_Y), angle_x, AXIS_X), angle_z, AXIS_Z), dz, AXIS_Z))))
	//}
	for (const f of faces) {
		for (let i = 0; i < f.length; i++){
			const a = vertices[f[i]]
			const b = vertices[f[(i+1)%f.length]]
			//if (b == undefined) {console.log('i: '+i, 'mod: '+(i+1)%f.length, 'face: ['+f+']')}
			line(normalize(project(translate(translate(translate(rotate(rotate(rotate(a, angle_y, AXIS_Y), angle_x, AXIS_X), angle_z, AXIS_Z), dx, AXIS_X), dy, AXIS_Y), dz, AXIS_Z))),
				normalize(project(translate(translate(translate(rotate(rotate(rotate(b, angle_y, AXIS_Y), angle_x, AXIS_X), angle_z, AXIS_Z), dx, AXIS_X), dy, AXIS_Y), dz, AXIS_Z))))
		}
	}
	setTimeout(draw, 1000 / FPS)
}

canvas.width = SCREEN.x
canvas.height = SCREEN.y

draw()
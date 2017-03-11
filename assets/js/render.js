function addSprite( name, number ) {

  let canvas = document.createElement( 'canvas' )
  let context = canvas.getContext( '2d' )
  let metrics = context.measureText( name )

  context.strokeStyle = 'rgba( 1, 95, 95, 1 )'
  context.fillStyle = 'rgba( 1, 95, 95, .4 )'
  roundRect( context, 0, 5, 300, 80, 20 )
  context.font = '20px Helvetica'
  context.fillStyle = 'rgba( 200, 200, 200, 0.95 )'

  if ( metrics.width < 150 ) {
    context.fillText( name, 150 - metrics.width, 50 )
  } else {
    context.fillText( name, 0, 50 )
  }

  let texture = new THREE.Texture( canvas )
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearFilter
	let spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture } )
	let sprite = new THREE.Sprite( spriteMaterial )

	sprite.scale.set( 25, 20, 1.0 )
  sprite.number = number
	spriteGroup.add( sprite )
  sprites.push( sprite )

}

//---------------------------------------------------------

function roundRect( context, x, y, w, h, r ) {

  context.beginPath()
  context.moveTo( x + r, y )
  context.lineTo( x + w - r, y)
  context.quadraticCurveTo( x + w, y, x + w, y + r )
  context.lineTo( x + w, y + h - r )
  context.quadraticCurveTo( x + w, y + h, x + w - r, y + h )
  context.lineTo( x + r, y + h )
  context.quadraticCurveTo( x, y + h, x, y + h - r )
  context.lineTo( x, y + r )
  context.quadraticCurveTo( x, y, x + r, y )
  context.closePath()
  context.fill()
  context.stroke()

}

//---------------------------------------------------------

function setLayout( group, objects, layout ) {

  if ( layout == 0 ) {

    planeLayout( group, objects )

  } else if ( layout == 1 ) {

    spiralLayout( group, objects )

  } else if ( layout == 2 ) {

    octafoliumLayout( group, objects )

  } else if ( layout == 3 ) {

    sphereLayout( group, objects )

  }

}

//---------------------------------------------------------

function changeLayout( group, objects, layout ) {

  if ( layout < 3 ) { layout ++ } else { layout = 0 }
  setLayout ( group, objects, layout )
  return layout

}

//---------------------------------------------------------

function changeColors() {

  if ( remote.getGlobal( 'config' ).cubeColors == colorFunctionArray.length - 1 ) {
    remote.getGlobal( 'config' ).cubeColors = 0
  } else {
    remote.getGlobal( 'config' ).cubeColors ++
  }
  calculateColor = colorFunctionArray[ remote.getGlobal( 'config' ).cubeColors ]

}

//---------------------------------------------------------

function cubeLayout( group, objects ) {

  let i = 0, side = Math.cbrt( objects.length )

  for ( let iz = 0; iz > -side; iz -- ) {
    for ( let iy = 0; iy > -side; iy -- ) {
        for ( let ix = 0; ix < side; ix ++ ) {

        if ( i < objects.length ) {
          objects[ i ].position.x = ix * spacingWidth
          objects[ i ].position.y = iy * spacingHeight
          objects[ i ].position.z = iz * spacingDepth
        }

        i ++

      }
    }
  }

  group.position.x = - spacingWidth * ( side - 1 ) / 2
  group.position.y = spacingHeight * ( side - 1 ) / 2
  calculateX( group, - spacingWidth )
  calculateY( group, - spacingHeight )
  checkIntersection()

}

//---------------------------------------------------------

function planeLayout( group, objects ) {

  let i = 0

  for ( let iz = 0; iz < 27; iz ++ ) {
      for ( let ix = 0; ix < 27; ix ++ ) {

      objects[ i ].position.x = ix * 26 - 351
      objects[ i ].position.y = - 50
      objects[ i ].position.z = - iz * 30

      i ++

    }
  }

  group.position.set( 0, 0, 0 )

}

//---------------------------------------------------------

function spiralLayout( group, objects ) {

  let i = 0

  for ( let k = 0; k < objects.length; k ++ ) {

    objects[ k ].position.x = 100 * Math.cos( k )
    objects[ k ].position.y = 100 * Math.sin( k )
    objects[ k ].position.z = i + zCam

    i -= 10

  }

  group.position.set( 0, 0, 0 )

}

//---------------------------------------------------------

function octafoliumLayout( group, objects ) {

  for ( let i = 0; i < objects.length; i ++ ) {

    objects[ i ].position.x = 800 * Math.cos( 4 * i ) * Math.cos( i )
    objects[ i ].position.y = - 200
    objects[ i ].position.z = - 800 * Math.cos( 4 * i ) * Math.sin( i ) - 1100

  }

  group.position.set( 0, 0, 0 )

}

//---------------------------------------------------------

function sphereLayout( group, objects ) {

  let radius = 300

    let i = 0, total = Math.floor( Math.sqrt( objects.length ) )

    for ( let j = 0; j < total; j ++ ) {
      let lon = j * Math.PI / ( total - Math.PI )
      for ( let k = 0; k < total; k ++ ) {
        let lat = k * Math.PI / ( total - ( Math.PI / 2 ) )

        let x = radius * Math.sin( lon ) * Math.cos( lat )
        let y = radius * Math.cos( lon )
        let z = radius * Math.sin( lon ) * Math.sin( lat )

        objects[ i ].position.x = x
        objects[ i ].position.y = y
        objects[ i ].position.z = z - 500

        i ++

      }
    }

    group.position.set( 0, 0, 0 )

}

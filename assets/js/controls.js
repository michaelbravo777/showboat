function onKeyDown( event ) {

  switch( event.keyCode ) {

    case 73: // i
      toggleInstructions()
      break

    case 83: // s
      if ( visuals ) {
        remote.getGlobal( 'config' ).cubeLayout = changeLayout ( cubeGroup, cubes, remote.getGlobal( 'config' ).cubeLayout )
      }
      break

    case 70: // f
    fullScreen()
      break

    case 27: // esc
    if ( remote.getGlobal( 'config' ).fullscreen ) { fullScreen() }
      break

    case 67: // c
      changeColors()
      break

    case 86: // v
      toggleVisuals()
      break

    case 66: // b
      playShuffle()
      break

    case 77: // m
      menu.popup( remote.getCurrentWindow() )
      break

    case 32: // space
      playAudio()
      break

    case 13: // enter
      select()
      break

    case 88: // x
      playForward()
      break

    case 90: // z
      playBack()
      break

    case 16: // shift
      moveZ( spriteGroup, sprites, spacingDepth )
      checkIntersection()
      break

    case 17: // control
      moveZ( spriteGroup, sprites, - spacingDepth )
      checkIntersection()
      break

    case 37: // left
      calculateX( spriteGroup, - spacingWidth )
      checkIntersection()
      break

    case 39: // right
      calculateX( spriteGroup, spacingWidth )
      checkIntersection()
      break

    case 38: // up
      calculateY( spriteGroup, - spacingHeight )
      checkIntersection()
      break

    case 40: // down
      calculateY( spriteGroup, spacingHeight )
      checkIntersection()
      break

    }

}

//---------------------------------------------------------

function onDocumentMouseDown( event ) {

  pressed = true
  moved = false

  reference.x = event.clientX
  reference.y = event.clientY

  if ( overTimeline ) { movePlayhead = true }

}

//---------------------------------------------------------

function onDocumentMouseUp( event ) {

  pressed = false

  if ( !moved && !overPlayer && !visuals && instructions.style.visibility == 'hidden' ) {

    select()

	}

  if ( movePlayhead ) {

    if ( player. currentTime ) {

      player.currentTime = duration * clickPercent( event )

    }

    movePlayhead  = false

  }

}

//---------------------------------------------------------

function onDocumentMouseMove( event ) {

  clearTimeout( timer )
  audioplayer.className = 'visible'

  if ( movePlayhead ) {

    var newMargLeft = playHeadPosition( duration * clickPercent( event ) )

    if ( newMargLeft < 0 ) {
      playhead.style.marginLeft = '0px'
    } else if ( newMargLeft > ( timeline.offsetWidth - playhead.offsetWidth ) ) {
      playhead.style.marginLeft = ( timeline.offsetWidth - playhead.offsetWidth )
    } else {
      playhead.style.marginLeft = newMargLeft + 'px'
    }

  } else if ( !overPlayer ) {

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1
  	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1

    raycaster.setFromCamera( mouse, camera )

    let intersects = raycaster.intersectObjects( sprites )

    if ( intersects.length > 0 ) {

      sprites[ selected ].material.color.set( 0xffffff )
      intersects[ 0 ].object.material.color.set( 0x777777 )
      selected = intersects[ 0 ].object.number

    }

    moved = true

    if ( pressed ) {

      if ( !visuals ) {

        moveX( spriteGroup, reference.x - event.clientX )
        reference.x = event.clientX

        moveY( spriteGroup, reference.y - event.clientY )
        reference.y = event.clientY

        }

    }

    timer = setTimeout( hidePlayer, 3000 )

  }

}

//---------------------------------------------------------

function onDocumentWheel( event ) {

  if ( event.deltaY < 0 ) {
    moveZ( spriteGroup, sprites, spacingDepth )
  } else {
    moveZ( spriteGroup, sprites, - spacingDepth )
  }

}


//---------------------------------------------------------

function select() {

  if ( elements[ selected ].type == 'Parent' ) {

    remote.getGlobal( 'config' ).musicPath = path.resolve( remote.getGlobal( 'config' ).musicPath, '..')

    remote.getCurrentWindow().reload()

  }

  else if ( elements[ selected ].type == 'Directory' ) {

    remote.getGlobal( 'config' ).musicPath = path.resolve( remote.getGlobal( 'config' ).musicPath, elements[ selected ].name )

    remote.getCurrentWindow().reload()

  } else {

    current = selected

    setSource()

    playAudio()

  }

}

//---------------------------------------------------------

function checkIntersection() {

    sprites[ selected ].material.color.set( 0xffffff )

    sprites.find( (sprite) => {
      if ( spriteGroup.position.z == 0 ) {
        if (
          sprite.position.x == - spriteGroup.position.x &&
          sprite.position.y == - spriteGroup.position.y &&
          sprite.position.z == - spriteGroup.position.z
           )
        {
          sprite.material.color.set( 0x777777 )
          selected = sprite.number
        }
      } else {
        if (
          sprite.position.x == - spriteGroup.position.x &&
          sprite.position.y == - spriteGroup.position.y &&
          sprite.position.z == - spriteGroup.position.z + 40
           )
        {
          sprite.material.color.set( 0x777777 )
          selected = sprite.number
        }
      }

    } )

}

//---------------------------------------------------------

function calculateX( objectGroup, distance ) {

  if ( objectGroup.position.x % spacingWidth == 0 ) {
    moveX( objectGroup, distance )
  } else {
    if ( distance < 0 ) {
      moveX( objectGroup, objectGroup.position.x % spacingWidth )
    } else {
      moveX( objectGroup, spacingWidth + objectGroup.position.x % spacingWidth )
    }
  }

}

//---------------------------------------------------------

function calculateY( objectGroup, distance ) {

  if ( objectGroup.position.y % spacingHeight == 0 ) {
    moveY( objectGroup, distance )
  } else {
    if ( distance < 0 ) {
      moveY( objectGroup, - objectGroup.position.y % spacingHeight )
    } else {
      moveY( objectGroup, spacingHeight - objectGroup.position.y % spacingHeight )
    }
  }

}

//----------------------------------------c-----------------

function moveX( objectGroup, distance ) {

  objectGroup.position.x -= distance

  if ( objectGroup.position.x > 0 ) {
    objectGroup.position.x = 0
  } else if ( objectGroup.position.x < - cubeSide * spacingWidth ) {
    objectGroup.position.x = - cubeSide * spacingWidth
  }

}

//---------------------------------------------------------

function moveY( objectGroup, distance ) {

  objectGroup.position.y += distance

  if ( objectGroup.position.y < 0 ) {
    objectGroup.position.y = 0
  } else if ( objectGroup.position.y > cubeSide * spacingHeight ) {
    objectGroup.position.y = cubeSide * spacingHeight
  }

}

//---------------------------------------------------------

function moveZ( objectGroup, objects, distance ) {

  objectGroup.position.z += distance

  if ( objectGroup.position.z < 0 ) {
    objectGroup.position.z = 0
  } else if ( objectGroup.position.z > - objects[ objects.length - 1 ].position.z + zCam - spacingDepth ) {
    objectGroup.position.z = - objects[ objects.length - 1 ].position.z + zCam - spacingDepth
  }

}

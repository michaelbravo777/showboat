function hidePlayer() {

  audioplayer.className = 'hidden'

}

//---------------------------------------------------------

function playBack() {

  if ( current > dir.length ) { current -- }
  else { current = elementsLength - 1 }

  setSource()

  playAudio()

}

//---------------------------------------------------------

function playForward() {

  if ( remote.getGlobal( 'config' ).shuffle == true ) {

    current = dir.length + Math.floor( Math.random() * mp3.length )

  } else {

    if ( current < elementsLength - 1 ) { current ++ }
    else { current = dir.length }

  }

  setSource()

  playAudio()

}

//---------------------------------------------------------

function playAudio() {

  if ( player.paused ) {
		player.play()
		pPlay.className = ''
		pPlay.className = 'button pause'
    pPlay.title = 'Pause'
	} else {
		player.pause()
		pPlay.className = ''
		pPlay.className = 'button play'
    pPlay.title = 'Play'
	}

}

//---------------------------------------------------------

function playShuffle() {

	if ( remote.getGlobal( 'config' ).shuffle == true ) {
    remote.getGlobal( 'config' ).shuffle = false
		pShuffle.className = ''
		pShuffle.className = 'button shuffle'
    pShuffle.title = 'Shuffle'
	} else {
    remote.getGlobal( 'config' ).shuffle  = true
		pShuffle.className = ''
		pShuffle.className = 'button sequential'
    pShuffle.title = 'Sequential Play'
	}

}

//---------------------------------------------------------

function timeUpdate() {

  if ( !movePlayhead ) {
    playhead.style.marginLeft = playHeadPosition( player.currentTime ) + 'px'
  }

}

//---------------------------------------------------------

function playHeadPosition( location ) {

	return ( timeline.offsetWidth - playhead.offsetWidth ) * location / duration

}

//---------------------------------------------------------

function clickPercent( event ) {

	return ( event.pageX - timeline.getClientRects()[0].left - .5 ) / timeline.offsetWidth

}

//---------------------------------------------------------

function setSource() {

  player.src = path.format( {
    dir: remote.getGlobal( 'config' ).musicPath,
    base: elements[ current ].name + '.mp3'
  } )

}

//---------------------------------------------------------

function fullScreen() {

  if ( remote.getGlobal( 'config' ).fullscreen ) {

    BrowserWindow.getFocusedWindow().setFullScreen( false )
    remote.getGlobal( 'config' ).fullscreen = false
    pFullScreen.title = 'Fullscreen'

  } else {

    BrowserWindow.getFocusedWindow().setFullScreen( true )
    remote.getGlobal( 'config' ).fullscreen = true
    pFullScreen.title = 'Normal'

  }

}

//---------------------------------------------------------

function toggleVisuals() {

  if ( visuals ) {

    pVisuals.title = 'Visuals'
    visuals = false
    spriteGroup.visible = true
    cubeGroup.visible = false

  } else {

    pVisuals.title = 'Files'
    visuals = true
    spriteGroup.visible = false
    cubeGroup.visible = true

  }
}

//---------------------------------------------------------

function toggleInstructions() {

  if ( instructions.style.visibility == 'hidden' ) {

    instructions.style.visibility = 'visible'

  } else {

    instructions.style.visibility = 'hidden'

  }
}

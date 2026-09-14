import type { SyntheticEvent, VideoHTMLAttributes } from 'react'

/** Standard controlsList value that hides download, playback speed, PiP, and fullscreen in native controls. */
export const PROTECTED_VIDEO_CONTROLS_LIST =
  'nodownload noplaybackrate nofullscreen noremoteplayback'

function enforceVideoMuted(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.volume = 0
}

/** Props to spread onto every portfolio <video> to disable download and related browser menus. */
export const protectedVideoProps = {
  disablePictureInPicture: true,
  controlsList: PROTECTED_VIDEO_CONTROLS_LIST,
  muted: true,
  onContextMenu: (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault()
  },
  onLoadedMetadata: (event: SyntheticEvent<HTMLVideoElement>) => {
    enforceVideoMuted(event.currentTarget)
  },
  onVolumeChange: (event: SyntheticEvent<HTMLVideoElement>) => {
    enforceVideoMuted(event.currentTarget)
  },
} satisfies Pick<
  VideoHTMLAttributes<HTMLVideoElement>,
  | 'disablePictureInPicture'
  | 'controlsList'
  | 'muted'
  | 'onContextMenu'
  | 'onLoadedMetadata'
  | 'onVolumeChange'
>

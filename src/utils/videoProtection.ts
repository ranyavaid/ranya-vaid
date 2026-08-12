import type { VideoHTMLAttributes } from 'react'

/** Standard controlsList value that hides download, playback speed, PiP, and fullscreen in native controls. */
export const PROTECTED_VIDEO_CONTROLS_LIST =
  'nodownload noplaybackrate nofullscreen noremoteplayback'

/** Props to spread onto every portfolio <video> to disable download and related browser menus. */
export const protectedVideoProps = {
  disablePictureInPicture: true,
  controlsList: PROTECTED_VIDEO_CONTROLS_LIST,
  onContextMenu: (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault()
  },
} satisfies Pick<
  VideoHTMLAttributes<HTMLVideoElement>,
  'disablePictureInPicture' | 'controlsList' | 'onContextMenu'
>

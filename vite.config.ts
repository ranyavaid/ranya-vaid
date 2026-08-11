import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function publicAssetVersion(relativePath: string): Plugin {
  const virtualModuleId = `virtual:public-asset-version/${relativePath}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  const absolutePath = path.resolve('public', relativePath)

  return {
    name: `public-asset-version:${relativePath}`,
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return

      const version = fs.existsSync(absolutePath)
        ? fs.statSync(absolutePath).mtimeMs
        : Date.now()

      return `export default ${JSON.stringify(String(version))}`
    },
    handleHotUpdate({ file, server }) {
      if (file !== absolutePath) return

      const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
      if (module) {
        server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
        return [module]
      }

      server.ws.send({ type: 'full-reload' })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    publicAssetVersion('okr Alignment/alignobj_kr.mp4'),
    publicAssetVersion('okr Alignment/assignkr_obj.mp4'),
    publicAssetVersion('okr Alignment/accept_obj.mp4'),
    publicAssetVersion('okr Alignment/editing.mp4'),
    publicAssetVersion('okr Alignment/alignkr_kr.mp4'),
    publicAssetVersion('okr Alignment/assignkr_kr.mp4'),
    publicAssetVersion('okr Alignment/accept_kr.mp4'),
    publicAssetVersion('okr Alignment/banner.mp4'),
  ],
})

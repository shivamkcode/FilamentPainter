# Filament Painter

A modern, responsive web application for creating beautiful filament paintings using WebGL2. Generate color lithophanes with precise control over filament layers, colors, and opacity.

## ✨ Features

### 🎨 Core Functionality
- **WebGL2-powered rendering** for fast, GPU-accelerated filament painting
- **Real-time preview** with instant visual feedback
- **Multiple topography functions** (nearest, bilinear, bicubic)
- **Precise layer control** with customizable layer heights and opacity
- **Color blending** using exponential curves that accurately simulate filament behavior

### 💾 Data Management
- **Automatic localStorage saving** - Your filaments are automatically saved as you work
- **Manual save/load controls** - Save, load, or clear your filament configurations
- **Project export/import** - Export your complete project as `.fpp` files for sharing and backup
- **Persistent settings** - All your project settings are preserved between sessions

### 🎯 User Experience
- **Modern, responsive design** - Works beautifully on desktop, tablet, and mobile devices
- **Intuitive drag-and-drop interface** - Reorder filament layers with ease
- **Real-time height calculations** - See the total height of your project as you work
- **Visual status indicators** - Clear feedback on save status and operations
- **Touch-friendly controls** - Optimized for both mouse and touch interactions

### 🔧 Advanced Controls
- **Global layer height settings** - Set default layer heights for consistency
- **Individual filament customization** - Unique colors, opacity, and layer heights per filament
- **Physical dimension mapping** - Map your digital design to real-world dimensions
- **Image resolution control** - Fine-tune the resolution of your source images

## 🚀 Getting Started

### Running Locally

1. **Clone or download** the repository
2. **Open `index.html`** in your web browser
3. **Upload an image** to get started with your filament painting
4. **Add filament layers** and customize colors, opacity, and heights
5. **Preview in real-time** and export your project when ready

### Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run dev
```

## 📁 Project Structure

```
FilamentPainter/
├── src/                    # TypeScript source code
│   ├── gl/                # WebGL2 rendering components
│   ├── services/          # Data management services
│   ├── ui/                # UI components and styling
│   └── tools/             # Utility functions
├── ui/                    # CSS styling and assets
├── build/                 # Compiled JavaScript (generated)
├── index.html            # Main application entry point
└── package.json          # Project configuration
```

## 🎛️ How It Works

### Core Algorithm
The application uses a brute force method to determine color at each layer:

1. **Start from layer 0** and increment height for each layer
2. **Apply color blending** using exponential curves: `(e^(-2x) - e^-2) / (1 - e^-2)`
3. **GPU acceleration** makes this computation fast and efficient
4. **Real-time rendering** provides instant visual feedback

### Key Components
- **Heights.ts** - Core computation engine for layer height calculations
- **FilamentPainter.ts** - Main application logic and UI management
- **LocalStorage.ts** - Data persistence and management
- **ProjectExport.ts** - Project import/export functionality

## 🎨 Usage Guide

### Creating a Filament Painting

1. **Upload Source Image**
   - Click "Choose File" to upload your reference image
   - The image will appear on the source canvas

2. **Configure Settings**
   - Set topography function (nearest, bilinear, bicubic)
   - Adjust layer height and base layer height
   - Set physical dimensions and image resolution

3. **Add Filament Layers**
   - Click "Add New Filament Layer" to create layers
   - Customize color, opacity, and layer height for each
   - Drag to reorder layers as needed

4. **Preview and Export**
   - See real-time preview on the preview canvas
   - Export your project as a `.fpp` file for sharing
   - Use localStorage to save your work automatically

### Managing Projects

- **Auto-save**: Your filaments are automatically saved as you work
- **Manual save**: Use the save button to explicitly save your current state
- **Load**: Restore previously saved filament configurations
- **Clear**: Remove all saved data (with confirmation)
- **Export**: Download your complete project as a `.fpp` file
- **Import**: Load projects from `.fpp` files

## 🛠️ Technical Details

### Technologies Used
- **TypeScript** - Type-safe JavaScript development
- **WebGL2** - GPU-accelerated rendering
- **HTML5 Canvas** - Image processing and display
- **LocalStorage API** - Client-side data persistence
- **File API** - Project import/export functionality

### Browser Compatibility
- Modern browsers with WebGL2 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with WebGL support

### Performance
- GPU-accelerated rendering for smooth performance
- Efficient memory management for large images
- Optimized for real-time preview updates

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is free to use and modify. See the LICENSE file for details.

## 🙏 Acknowledgments

- Built with WebGL2 for high-performance graphics
- Inspired by traditional lithophane techniques
- Community-driven development and improvements

---

**Happy Filament Painting! 🎨✨** 
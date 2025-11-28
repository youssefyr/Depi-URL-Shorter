#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

KIND_VERSION="v0.20.0"

echo -e "${CYAN}🔧 Kind Installation Script${NC}"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        ARCH="amd64"
    elif [ "$ARCH" = "aarch64" ]; then
        ARCH="arm64"
    fi
    INSTALL_DIR="/usr/local/bin"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    ARCH="amd64"
    INSTALL_DIR="$HOME/bin"
    # For Windows, we'll use a different approach
else
    echo -e "${RED}❌ Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${BLUE}Detected OS: ${OS} (${ARCH})${NC}"

# Check if kind is already installed
if command -v kind &> /dev/null; then
    CURRENT_VERSION=$(kind version | grep -oP 'kind v\K[0-9.]+' || echo "unknown")
    echo -e "${GREEN} Kind is already installed (version: $CURRENT_VERSION)${NC}"
    echo -e "${YELLOW} Location: $(which kind)${NC}"
    echo ""
    echo -e "${YELLOW}Do you want to reinstall/upgrade? (y/n)${NC}"
    read -r REINSTALL
    if [[ ! "$REINSTALL" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN} Skipping installation${NC}"
        exit 0
    fi
fi

# Install for Linux
if [ "$OS" = "linux" ]; then
    echo -e "${CYAN}Downloading Kind ${KIND_VERSION} for Linux...${NC}"
    
    DOWNLOAD_URL="https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-${ARCH}"
    
    # Download to temp location
    TMP_FILE="/tmp/kind"
    curl -Lo "$TMP_FILE" "$DOWNLOAD_URL"
    
    # Make executable
    chmod +x "$TMP_FILE"
    
    # Move to install directory (might need sudo)
    echo -e "${YELLOW}Installing to ${INSTALL_DIR} (may require sudo)...${NC}"
    if [ -w "$INSTALL_DIR" ]; then
        mv "$TMP_FILE" "${INSTALL_DIR}/kind"
    else
        sudo mv "$TMP_FILE" "${INSTALL_DIR}/kind"
    fi
    
    echo -e "${GREEN} Kind installed successfully!${NC}"
    echo -e "${BLUE}📍 Location: ${INSTALL_DIR}/kind${NC}"
    
    # Check if in PATH
    if [[ ":$PATH:" == *":${INSTALL_DIR}:"* ]]; then
        echo -e "${GREEN} ${INSTALL_DIR} is already in PATH${NC}"
    else
        echo -e "${YELLOW}⚠️  ${INSTALL_DIR} is not in PATH${NC}"
        echo -e "${CYAN}Add to your shell profile (~/.bashrc or ~/.zshrc):${NC}"
        echo -e "  export PATH=\"\$PATH:${INSTALL_DIR}\""
        echo ""
        echo -e "${YELLOW}Or run now:${NC}"
        echo -e "  export PATH=\"\$PATH:${INSTALL_DIR}\""
    fi

# Install for Windows
elif [ "$OS" = "windows" ]; then
    echo -e "${CYAN}📥 Downloading Kind ${KIND_VERSION} for Windows...${NC}"
    
    DOWNLOAD_URL="https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-windows-${ARCH}"
    
    # Create install directory if it doesn't exist
    mkdir -p "$INSTALL_DIR"
    
    # Download
    KIND_EXE="${INSTALL_DIR}/kind.exe"
    curl -Lo "$KIND_EXE" "$DOWNLOAD_URL"
    
    echo -e "${GREEN} Kind installed successfully!${NC}"
    echo -e "${BLUE} Location: ${KIND_EXE}${NC}"
    
    # Check if in PATH
    if [[ ":$PATH:" == *":${INSTALL_DIR}:"* ]]; then
        echo -e "${GREEN} ${INSTALL_DIR} is already in PATH${NC}"
    else
        echo -e "${YELLOW}⚠️  Adding ${INSTALL_DIR} to PATH...${NC}"
        
        # Add to PATH for current session
        export PATH="$PATH:$INSTALL_DIR"
        
        # Add to .bashrc or .bash_profile
        SHELL_PROFILE=""
        if [ -f "$HOME/.bashrc" ]; then
            SHELL_PROFILE="$HOME/.bashrc"
        elif [ -f "$HOME/.bash_profile" ]; then
            SHELL_PROFILE="$HOME/.bash_profile"
        fi
        
        if [ -n "$SHELL_PROFILE" ]; then
            if ! grep -q "export PATH.*${INSTALL_DIR}" "$SHELL_PROFILE"; then
                echo "" >> "$SHELL_PROFILE"
                echo "# Added by kind installation script" >> "$SHELL_PROFILE"
                echo "export PATH=\"\$PATH:${INSTALL_DIR}\"" >> "$SHELL_PROFILE"
                echo -e "${GREEN} Added to ${SHELL_PROFILE}${NC}"
                echo -e "${YELLOW}Please restart your terminal or run:${NC}"
                echo -e "  source ${SHELL_PROFILE}"
            fi
        else
            echo -e "${YELLOW}  Could not find shell profile${NC}"
            echo -e "${CYAN}Add to your shell profile manually:${NC}"
            echo -e "  export PATH=\"\$PATH:${INSTALL_DIR}\""
        fi
    fi
fi

# Verify installation
echo ""
echo -e "${CYAN}🔍 Verifying installation...${NC}"
if kind version &> /dev/null; then
    VERSION=$(kind version)
    echo -e "${GREEN}✅ Kind is working!${NC}"
    echo -e "${BLUE}${VERSION}${NC}"
else
    echo -e "${RED}❌ Kind installation failed or not in PATH${NC}"
    echo -e "${YELLOW}Try running: export PATH=\"\$PATH:${INSTALL_DIR}\"${NC}"
    exit 1
fi

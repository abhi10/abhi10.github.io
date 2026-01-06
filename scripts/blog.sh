#!/bin/bash

# Blog management script for araju.dev
# Source folder for drafts (your native-ai blogs folder)
SOURCE_DIR="/Users/abhishekrajuchamarthi/Dropbox/Mac/Documents/workspace_personal/native-ai/image-hosting-app/blogs"
# Portfolio repo paths
REPO_DIR="/Users/abhishekrajuchamarthi/Dropbox/Mac/Documents/workspace_personal/araju.github.io"
DRAFTS_DIR="$REPO_DIR/drafts"
PUBLISH_DIR="$REPO_DIR/src/content/blog"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    echo "Blog Management Script"
    echo ""
    echo "Usage: ./scripts/blog.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list          List all drafts in source folder"
    echo "  pull <file>   Copy a draft from source to drafts folder"
    echo "  pull-all      Copy all markdown files from source to drafts"
    echo "  publish <file> Move a draft to the published blog folder"
    echo "  drafts        List files in local drafts folder"
    echo "  published     List published blog posts"
    echo ""
    echo "Examples:"
    echo "  ./scripts/blog.sh list"
    echo "  ./scripts/blog.sh pull BLOG_POST_OUTLINE.md"
    echo "  ./scripts/blog.sh publish my-post.md"
}

list_source() {
    echo -e "${BLUE}Available drafts in source folder:${NC}"
    echo "$SOURCE_DIR"
    echo ""
    ls -la "$SOURCE_DIR"/*.md 2>/dev/null || echo "No markdown files found"
}

list_drafts() {
    echo -e "${BLUE}Local drafts (not published):${NC}"
    echo "$DRAFTS_DIR"
    echo ""
    ls -la "$DRAFTS_DIR"/*.md 2>/dev/null || echo "No drafts found"
}

list_published() {
    echo -e "${GREEN}Published blog posts:${NC}"
    echo "$PUBLISH_DIR"
    echo ""
    ls -la "$PUBLISH_DIR"/*.md 2>/dev/null || echo "No published posts found"
}

pull_file() {
    local filename="$1"
    if [ -z "$filename" ]; then
        echo "Error: Please specify a filename"
        exit 1
    fi

    local source_path="$SOURCE_DIR/$filename"
    if [ ! -f "$source_path" ]; then
        echo "Error: File not found: $source_path"
        exit 1
    fi

    mkdir -p "$DRAFTS_DIR"
    cp "$source_path" "$DRAFTS_DIR/"
    echo -e "${GREEN}Copied:${NC} $filename -> drafts/"
}

pull_all() {
    mkdir -p "$DRAFTS_DIR"
    cp "$SOURCE_DIR"/*.md "$DRAFTS_DIR/" 2>/dev/null
    echo -e "${GREEN}Copied all markdown files to drafts/${NC}"
    list_drafts
}

publish_file() {
    local filename="$1"
    if [ -z "$filename" ]; then
        echo "Error: Please specify a filename"
        exit 1
    fi

    local draft_path="$DRAFTS_DIR/$filename"
    if [ ! -f "$draft_path" ]; then
        echo "Error: Draft not found: $draft_path"
        echo "Available drafts:"
        ls "$DRAFTS_DIR"/*.md 2>/dev/null
        exit 1
    fi

    # Check if file has frontmatter
    if ! head -1 "$draft_path" | grep -q "^---"; then
        echo -e "${YELLOW}Warning:${NC} File may not have proper frontmatter for Astro"
        echo "Required frontmatter format:"
        echo "---"
        echo "title: \"Your Title\""
        echo "description: \"Your description\""
        echo "pubDate: $(date +%Y-%m-%d)"
        echo "tags: [\"tag1\", \"tag2\"]"
        echo "draft: false"
        echo "---"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    cp "$draft_path" "$PUBLISH_DIR/"
    echo -e "${GREEN}Published:${NC} $filename -> src/content/blog/"
    echo ""
    echo "Next steps:"
    echo "  1. Review: npm run dev"
    echo "  2. Commit: git add . && git commit -m 'Add blog post: $filename'"
    echo "  3. Push: git push origin master"
}

# Main
case "$1" in
    list)
        list_source
        ;;
    drafts)
        list_drafts
        ;;
    published)
        list_published
        ;;
    pull)
        pull_file "$2"
        ;;
    pull-all)
        pull_all
        ;;
    publish)
        publish_file "$2"
        ;;
    *)
        usage
        ;;
esac

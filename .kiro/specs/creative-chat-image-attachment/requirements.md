# Requirements Document: Creative Chat Image Attachment

## Introduction

This feature adds image attachment capability to the Creative Chat Mode input area. Users can upload images and the AI will analyze them using the Shenma API's gpt-4o model, enabling multi-modal conversations where images can be referenced in chat messages.

## Glossary

- **Creative_Chat_Mode**: The chat interface in the right sidebar that allows users to have conversations with AI
- **Image_Attachment**: An image file uploaded by the user to be included in a chat message
- **Image_Analysis**: The process of using gpt-4o model to analyze and describe images
- **Attachment_Icon**: A visual button/icon in the input area for uploading images
- **Chat_Message**: A message in the conversation history that may include text and/or images
- **Shenma_API**: The API provider configured for multimedia operations including image analysis

## Requirements

### Requirement 1: Image Attachment Button

**User Story:** As a user, I want to attach images to my chat messages, so that I can ask the AI to analyze or discuss images in the creative chat.

#### Acceptance Criteria

1. WHEN the user views the creative chat input area THEN the system SHALL display an attachment icon button in the bottom-right corner of the input box
2. WHEN the user clicks the attachment icon THEN the system SHALL open a file picker dialog allowing image selection
3. WHEN the user selects an image file THEN the system SHALL accept common image formats (JPEG, PNG, WebP, GIF)
4. WHEN an image is selected THEN the system SHALL display a preview of the selected image near the input area
5. WHEN an image is attached THEN the system SHALL allow the user to clear/remove the image before sending

### Requirement 2: Image Upload and Preview

**User Story:** As a user, I want to see a preview of the image I'm about to send, so that I can verify it's the correct image before submitting.

#### Acceptance Criteria

1. WHEN an image is selected THEN the system SHALL display a thumbnail preview of the image
2. WHEN the preview is displayed THEN the system SHALL show the image dimensions or file size
3. WHEN the user hovers over the preview THEN the system SHALL display a remove/clear button
4. WHEN the user clicks the remove button THEN the system SHALL clear the image attachment and return to the normal input state
5. WHEN multiple images are selected THEN the system SHALL handle them sequentially or display a carousel (implementation choice)

### Requirement 3: Image Inclusion in Chat Messages

**User Story:** As a user, I want the AI to analyze images I send, so that I can get insights about the images in our conversation.

#### Acceptance Criteria

1. WHEN the user sends a message with an attached image THEN the system SHALL include the image in the chat message sent to the API
2. WHEN a message with an image is sent THEN the system SHALL convert the image to a URL or base64 format compatible with the Shenma API
3. WHEN the image is included in the message THEN the system SHALL display the image in the chat history alongside the user's text
4. WHEN the AI responds to an image THEN the system SHALL display the AI's analysis in the chat history
5. WHEN an image message is sent THEN the system SHALL clear the image attachment from the input area

### Requirement 4: API Integration with Shenma (Non-Breaking)

**User Story:** As a developer, I want the image attachment feature to use the existing Shenma API configuration without affecting existing functionality, so that image analysis works seamlessly without breaking current features.

#### Acceptance Criteria

1. WHEN an image is included in a chat message THEN the system SHALL use the Shenma API's /v1/chat/completions endpoint for image analysis only
2. WHEN sending a message without an image THEN the system SHALL use the existing chat flow without any changes
3. WHEN sending an image to the API THEN the system SHALL format the message according to the gpt-4o model's requirements with image_url content type
4. WHEN the API is called THEN the system SHALL use the configured API key and base URL from the existing Shenma configuration
5. WHEN the API responds THEN the system SHALL extract the analysis text and display it in the chat
6. WHEN an API error occurs THEN the system SHALL display an appropriate error message and NOT affect the chat history or existing messages
7. WHEN the image attachment feature is not used THEN the system SHALL behave identically to the current implementation

### Requirement 5: Error Handling (Non-Breaking)

**User Story:** As a user, I want clear feedback when something goes wrong, so that I understand why an image couldn't be analyzed without disrupting my conversation.

#### Acceptance Criteria

1. IF the image file is too large THEN the system SHALL reject it and display a message indicating the size limit
2. IF the image format is not supported THEN the system SHALL reject it and display a message listing supported formats
3. IF the API call fails THEN the system SHALL display an error message and allow the user to retry without affecting the chat history
4. IF the image upload is cancelled THEN the system SHALL return to the normal input state without errors
5. WHEN an error occurs THEN the system SHALL maintain the chat history and allow the user to continue the conversation
6. WHEN an image analysis fails THEN the system SHALL NOT clear the image attachment, allowing the user to retry or modify the prompt

### Requirement 6: UI/UX Integration

**User Story:** As a user, I want the image attachment feature to feel natural and integrated with the existing chat interface, so that it doesn't disrupt my workflow.

#### Acceptance Criteria

1. WHEN the input area is displayed THEN the attachment icon SHALL be positioned consistently with the existing send button
2. WHEN the user is typing THEN the attachment icon SHALL remain visible and accessible
3. WHEN an image is attached THEN the preview SHALL not obscure the input field or send button
4. WHEN the chat is loading THEN the attachment button SHALL be disabled to prevent multiple submissions
5. WHEN the interface updates THEN the attachment functionality SHALL remain responsive and not cause layout shifts

### Requirement 7: Image Format Handling

**User Story:** As a developer, I want images to be properly formatted for the API, so that the image analysis works correctly.

#### Acceptance Criteria

1. WHEN an image is selected THEN the system SHALL convert it to a format compatible with the Shenma API
2. WHEN the image is local THEN the system SHALL convert it to base64 or upload it to generate a URL
3. WHEN the image is already a URL THEN the system SHALL use the URL directly in the API request
4. WHEN the image is converted THEN the system SHALL maintain image quality and not introduce artifacts
5. WHEN the API receives the image THEN the system SHALL format the message with proper content type (image_url)

### Requirement 8: Backward Compatibility

**User Story:** As a developer, I want to ensure that existing chat functionality remains unchanged, so that users without images can continue using the chat normally.

#### Acceptance Criteria

1. WHEN a user sends a text-only message THEN the system SHALL use the exact same API call format as before
2. WHEN the chat history is displayed THEN messages without images SHALL appear exactly as they did previously
3. WHEN the existing chat features are used THEN the system SHALL NOT introduce any performance degradation
4. WHEN the API configuration is checked THEN the system SHALL NOT modify any existing Shenma API settings
5. WHEN the chat mode is switched THEN the image attachment feature SHALL NOT affect the script mode or other features


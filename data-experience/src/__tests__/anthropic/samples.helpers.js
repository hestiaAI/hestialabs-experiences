export const conversations = [
  {
    uuid: 'conv-001',
    name: 'Project Planning',
    created_at: '2024-07-19T09:33:25.915003Z',
    updated_at: '2024-07-19T09:33:33.019493Z',
    chat_messages: [
      {
        uuid: 'msg-001',
        text: 'Help me plan this migration.',
        sender: 'human',
        created_at: '2024-07-19T09:33:31.582203Z',
        updated_at: '2024-07-19T09:33:31.582203Z',
        attachments: [],
        files: [],
        content: [],
        parent_message_uuid: '00000000-0000-4000-8000-000000000000'
      },
      {
        uuid: 'msg-002',
        text: 'Sure, let us break it into milestones.',
        sender: 'assistant',
        created_at: '2024-07-19T09:33:32.000000Z',
        updated_at: '2024-07-19T09:33:32.000000Z',
        attachments: [],
        files: [],
        content: [],
        parent_message_uuid: 'msg-001'
      }
    ]
  }
]

export const memories = [
  {
    account_uuid: 'acc-001',
    conversations_memory: 'User is working on data flow analysis for legal research.'
  }
]

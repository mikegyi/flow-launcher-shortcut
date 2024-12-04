import axios from 'axios';
import open from 'open';

interface FlowLauncherResult {
    Title: string;
    Subtitle: string;
    JsonRPCAction?: {
        method: string;
        parameters: any[];
    };
    IcoPath: string;
    score: number;
}

interface ShortcutStory {
    name: string;
    story_type: string;
    workflow_state: {
        name: string;
    };
    app_url: string;
}

const { method, parameters, settings } = JSON.parse(process.argv[2]);

const SHORTCUT_API_TOKEN = settings?.api_token || '';
const SHORTCUT_API_URL = 'https://api.app.shortcut.com/api/v3';

async function searchStories(query: string): Promise<FlowLauncherResult[]> {
    if (!query) {
        return [
            {
                Title: 'Search Shortcut Stories',
                Subtitle: 'Start typing to search stories...',
                IcoPath: 'Images\\app.png',
                score: 100
            },
            {
                Title: 'Create New Story',
                Subtitle: 'Type "new" followed by story title to create a new story',
                JsonRPCAction: {
                    method: 'create_story',
                    parameters: ['']
                },
                IcoPath: 'Images\\app.png',
                score: 90
            }
        ];
    }

    if (query.toLowerCase().startsWith('new ')) {
        const storyTitle = query.slice(4);
        return [{
            Title: 'Create New Story',
            Subtitle: `Create: ${storyTitle}`,
            JsonRPCAction: {
                method: 'create_story',
                parameters: [storyTitle]
            },
            IcoPath: 'Images\\app.png',
            score: 100
        }];
    }

    try {
        const response = await axios.get(`${SHORTCUT_API_URL}/search/stories`, {
            headers: {
                'Shortcut-Token': SHORTCUT_API_TOKEN
            },
            params: {
                query: query
            }
        });

        return response.data.data.map((story: ShortcutStory) => ({
            Title: story.name,
            Subtitle: `${story.story_type} - ${story.workflow_state.name}`,
            JsonRPCAction: {
                method: 'open_story',
                parameters: [story.app_url]
            },
            IcoPath: 'Images\\app.png',
            score: 100
        }));
    } catch (error) {
        return [{
            Title: 'Error',
            Subtitle: 'Failed to fetch stories. Please check your API token.',
            IcoPath: 'Images\\app.png',
            score: 100
        }];
    }
}

async function createStory(title: string): Promise<void> {
    try {
        const response = await axios.post(
            `${SHORTCUT_API_URL}/stories`,
            {
                name: title,
                story_type: 'feature'
            },
            {
                headers: {
                    'Shortcut-Token': SHORTCUT_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );
        open(response.data.app_url);
    } catch (error) {
        console.error('Failed to create story:', error);
    }
}

async function handleQuery() {
    const query = parameters.join(' ');
    if (!SHORTCUT_API_TOKEN) {
        console.log(JSON.stringify({
            result: [{
                Title: 'API Token Required',
                Subtitle: 'Please set your Shortcut API token in the plugin settings',
                IcoPath: 'Images\\app.png',
                score: 100
            }]
        }));
        return;
    }

    const results = await searchStories(query);
    console.log(JSON.stringify({ result: results }));
}

if (method === 'query') {
    handleQuery();
} else if (method === 'open_story') {
    const url = parameters[0];
    open(url);
} else if (method === 'create_story') {
    const title = parameters[0];
    createStory(title);
} 
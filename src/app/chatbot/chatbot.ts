import { Component, inject } from '@angular/core';
import OpenAI from 'openai';
import { firstValueFrom } from 'rxjs';
import { ChatApi } from '../chat-api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'post-chatbot',
  imports: [],
  styleUrl: './chatbot.css',
  templateUrl: './chatbot.html'
})
export class Chatbot {

  private chatBotService = inject(ChatApi);

  private client = new OpenAI({

    // Use a new/rotated key for testing only.
    // apiKey: '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',
    
    apiKey:environment.openaiApiKey,
    dangerouslyAllowBrowser: true
  });


  // ---------------------------------------
  // TOOLS
  // ---------------------------------------

  private tools: any[] = [

    {
      type: "function",

      function: {

        name: "addPost",

        description: "Add a new post to the API",

        parameters: {

          type: "object",

          properties: {

            title: {
              type: "string"
            },

            description: {
              type: "string"
            },

            user_id: {
              type: "string"
            }

          },

          required: [
            "title",
            "description",
            "user_id"
          ]
        }
      }
    },


    {
      type: "function",

      function: {

        name: "getPost",

        description: "Get posts belonging to a particular user",

        parameters: {

          type: "object",

          properties: {

            user_id: {
              type: "string"
            }

          },

          required: [
            "user_id"
          ]
        }
      }
    }

  ];


  // ---------------------------------------
  // ADD POST TOOL
  // ---------------------------------------

  async addPost(
    title: string,
    description: string,
    user_id: string
  ) {

    const data = {
      title,
      description,
      user_id
    };

    const result = await firstValueFrom(
      this.chatBotService.addPost(data)
    );

    return result;
  }


  // ---------------------------------------
  // GET POST TOOL
  // ---------------------------------------

  async getPost(user_id: string) {

    const posts: any = await firstValueFrom(
      this.chatBotService.getAllPosts()
    );

    const result = posts.filter(
      (post: any) =>
        String(post.user_id) === String(user_id)
    );

    return result;
  }


  // ---------------------------------------
  // ASK AI
  // ---------------------------------------

  async askAI(event: SubmitEvent) {

    event.preventDefault();


    const input =
      document.getElementById(
        "prompt"
      ) as HTMLInputElement;


    const question = input.value;


    console.log("User:", question);


    // ---------------------------------------
    // STEP 1
    // Ask OpenAI
    // ---------------------------------------

    const responses =
      await this.client.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          {
            role: "user",
            content: question
          }

        ],

        tools: this.tools

      });


    // ---------------------------------------
    // STEP 2
    // Get assistant message
    // ---------------------------------------

    const message =
      responses.choices[0].message;


    console.log(
      "OpenAI message:",
      message
    );


    // ---------------------------------------
    // STEP 3
    // Check tool call
    // ---------------------------------------

    if (!message.tool_calls) {

      console.log(
        "AI:",
        message.content
      );

      return;
    }


    // ---------------------------------------
    // STEP 4
    // Get tool call
    // ---------------------------------------

    const toolCall:any =
      message.tool_calls[0];


    const toolName =
      toolCall.function.name;


    const toolArgs =
      JSON.parse(
        toolCall.function.arguments
      );


    console.log(
      "Tool:",
      toolName
    );

    console.log(
      "Arguments:",
      toolArgs
    );


    // ---------------------------------------
    // STEP 5
    // Execute Angular tool
    // ---------------------------------------

    let toolResult: any;


    if (toolName === "addPost") {

      toolResult =
        await this.addPost(
          toolArgs.title,
          toolArgs.description,
          toolArgs.user_id
        );

    }


    else if (toolName === "getPost") {

      toolResult =
        await this.getPost(
          toolArgs.user_id
        );

    }


    else {

      toolResult = {
        error: "Unknown tool"
      };

    }


    console.log(
      "Tool Result:",
      toolResult
    );


    // ---------------------------------------
    // STEP 6
    // Send tool result back to OpenAI
    // ---------------------------------------

    const finalResponse =
      await this.client.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          // User message
          {
            role: "user",
            content: question
          },


          // Assistant's tool call
          message,


          // Tool result
          {
            role: "tool",

            tool_call_id:
              toolCall.id,

            content:
              JSON.stringify(toolResult)
          }

        ],

        tools: this.tools

      });


    // ---------------------------------------
    // STEP 7
    // Final AI response
    // ---------------------------------------

    const finalMessage =
      finalResponse.choices[0].message;


    console.log(
      "Agent:",
      finalMessage.content
    );

  }

}
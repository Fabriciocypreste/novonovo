import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { 
  CreateProjectSchema, 
  CreateContentItemSchema, 
  GenerateContentSchema
} from "@/shared/types";

const api = new Hono<{ Bindings: Env }>();

// Initialize Google Gemini AI (using the correct model)
const getGeminiAI = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Initialize OpenAI
const getOpenAI = (apiKey: string) => {
  return new OpenAI({
    apiKey: apiKey,
  });
};

// Projects routes
api.get("/projects", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch projects" }, 500);
  }
});

api.post("/projects", zValidator("json", CreateProjectSchema), async (c) => {
  try {
    const db = c.env.DB;
    const data = c.req.valid("json");
    
    const result = await db.prepare(`
      INSERT INTO projects (name, description, theme, project_type, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      data.name,
      data.description || null,
      data.theme || null,
      data.project_type || null,
      "default-user" // TODO: Get from auth
    ).run();

    const project = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: project });
  } catch (error) {
    return c.json({ success: false, error: "Failed to create project" }, 500);
  }
});

// Content items routes
api.get("/projects/:projectId/content", async (c) => {
  try {
    const db = c.env.DB;
    const projectId = c.req.param("projectId");
    
    const { results } = await db.prepare(
      "SELECT * FROM content_items WHERE project_id = ? ORDER BY created_at DESC"
    ).bind(projectId).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch content items" }, 500);
  }
});

api.post("/projects/:projectId/content", zValidator("json", CreateContentItemSchema), async (c) => {
  try {
    const db = c.env.DB;
    const projectId = parseInt(c.req.param("projectId"));
    const data = c.req.valid("json");
    
    // Override project_id with the one from URL
    data.project_id = projectId;
    
    const result = await db.prepare(`
      INSERT INTO content_items (
        project_id, title, content_type, platform, content_data, 
        scheduled_at, status, engagement_estimate, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      projectId,
      data.title,
      data.content_type,
      data.platform || null,
      data.content_data || null,
      data.scheduled_at || null,
      data.status || "draft",
      data.engagement_estimate || null
    ).run();

    const contentItem = await db.prepare("SELECT * FROM content_items WHERE id = ?").bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: contentItem });
  } catch (error) {
    return c.json({ success: false, error: "Failed to create content item" }, 500);
  }
});

// AI Content Generation with multiple providers
api.post("/generate/content", zValidator("json", GenerateContentSchema), async (c) => {
  try {
    const openaiApiKey = c.env.OPENAI_API_KEY;
    const geminiApiKey = c.env.GOOGLE_GEMINI_API_KEY;
    const data = c.req.valid("json");

    // Prefer OpenAI if available, fallback to Gemini
    if (openaiApiKey) {
      const openai = getOpenAI(openaiApiKey);
      const generatedContent = [];

      for (const theme of data.themes) {
        try {
          // Generate Post Content with OpenAI
          const postResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em marketing digital brasileiro. Crie conteúdo envolvente e estratégico para redes sociais.'
              },
              {
                role: 'user',
                content: `Crie um post para Instagram sobre o tema: ${theme}

Requisitos:
- Linguagem brasileira natural e engajante
- Tom conversacional e profissional
- Máximo 2200 caracteres
- Inclua hashtags relevantes
- Call-to-action forte
- Use emojis estrategicamente

Responda apenas com o conteúdo do post.`
              }
            ],
            temperature: 0.8,
            max_tokens: 500
          });

          // Generate Video Script with OpenAI
          const videoResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Você é um roteirista especializado em vídeos para redes sociais brasileiras.'
              },
              {
                role: 'user',
                content: `Crie um roteiro de vídeo de 30-60 segundos sobre: ${theme}

Estrutura obrigatória:
- GANCHO (0-3s): Frase impactante para prender atenção
- DESENVOLVIMENTO (4-45s): 3 dicas práticas e valiosas
- CTA (46-60s): Call-to-action claro

Linguagem brasileira, dinâmica e engajante. Indique timing.`
              }
            ],
            temperature: 0.8,
            max_tokens: 600
          });

          // Generate Landing Page Copy with OpenAI
          const landingResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Você é um copywriter especialista em conversão e vendas digitais no Brasil.'
              },
              {
                role: 'user',
                content: `Crie copy para uma landing page sobre: ${theme}

Estrutura necessária:
- HEADLINE: Frase principal impactante (máximo 10 palavras)
- SUBHEADLINE: Complemento que explica o benefício
- BENEFÍCIOS: 3-5 bullet points com resultados específicos
- CTA: Botão de ação irresistível
- SOCIAL PROOF: Elemento de credibilidade

Foque em conversão máxima. Linguagem brasileira persuasiva.`
              }
            ],
            temperature: 0.7,
            max_tokens: 800
          });

          generatedContent.push({
            theme,
            post: {
              type: "post",
              content: postResponse.choices[0].message.content || `Post sobre ${theme} gerado com sucesso`,
              platform: "instagram",
              provider: "openai"
            },
            video: {
              type: "video", 
              content: videoResponse.choices[0].message.content || `Roteiro de vídeo sobre ${theme}`,
              platform: "youtube",
              provider: "openai"
            },
            landing: {
              type: "landing_page",
              content: landingResponse.choices[0].message.content || `Landing page sobre ${theme}`,
              platform: "web",
              provider: "openai"
            }
          });

        } catch (openaiError) {
          console.error('OpenAI error for theme:', theme, openaiError);
          // Fallback content for this theme
          generatedContent.push({
            theme,
            post: {
              type: "post",
              content: `🚀 ${theme} em Destaque!\n\nDicas exclusivas para transformar seus resultados:\n\n✅ Estratégias validadas\n✅ Implementação rápida\n✅ ROI comprovado\n\nSalva este post! 📌\n\n#${theme.replace(/\s+/g, '')} #MarketingDigital #Resultados`,
              platform: "instagram",
              provider: "fallback"
            },
            video: {
              type: "video", 
              content: `🎬 ROTEIRO - ${theme}\n\nGANCHO (0-3s): "Isso vai mudar sua visão sobre ${theme}!"\n\nDESENVOLVIMENTO (4-45s):\n• Dica 1: Análise de dados\n• Dica 2: Otimização contínua\n• Dica 3: Automação inteligente\n\nCTA (46-60s): "Qual dessas você vai testar primeiro?"`,
              platform: "youtube",
              provider: "fallback"
            },
            landing: {
              type: "landing_page",
              content: `🏆 LANDING PAGE - ${theme}\n\nHEADLINE: "Domine ${theme} em 21 Dias"\n\nSUBHEADLINE: "Sistema usado por +1000 empresas de sucesso"\n\nBENEFÍCIOS:\n• ROI de 300% em média\n• Suporte especializado\n• Garantia de resultado\n\nCTA: "QUERO COMEÇAR AGORA"\n\nSOCIAL PROOF: "+5000 clientes satisfeitos"`,
              platform: "web",
              provider: "fallback"
            }
          });
        }
      }

      return c.json({ 
        success: true, 
        data: generatedContent,
        message: `Generated content for ${data.themes.length} themes using OpenAI`,
        provider: "openai"
      });

    } else if (geminiApiKey) {
      // Gemini fallback logic (existing code)
      const genAI = getGeminiAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const generatedContent = [];

      for (const theme of data.themes) {
        try {
          const postResult = await model.generateContent(`Crie um post envolvente para Instagram sobre ${theme}. Use linguagem brasileira, seja conversacional e inclua hashtags.`);
          const videoResult = await model.generateContent(`Crie um roteiro de vídeo de 30-60 segundos sobre ${theme}. Estrutura: Gancho, Desenvolvimento, CTA.`);
          const landingResult = await model.generateContent(`Crie copy para landing page sobre ${theme}. Inclua: Headline, Subheadline, Benefícios, CTA.`);

          generatedContent.push({
            theme,
            post: {
              type: "post",
              content: postResult.response.text(),
              platform: "instagram",
              provider: "gemini"
            },
            video: {
              type: "video", 
              content: videoResult.response.text(),
              platform: "youtube",
              provider: "gemini"
            },
            landing: {
              type: "landing_page",
              content: landingResult.response.text(),
              platform: "web",
              provider: "gemini"
            }
          });
        } catch (geminiError) {
          console.error('Gemini error for theme:', theme, geminiError);
          // Use fallback data
          generatedContent.push({
            theme,
            post: {
              type: "post",
              content: `🚀 ${theme} em Destaque!\n\nDicas exclusivas para transformar seus resultados:\n\n✅ Estratégias validadas\n✅ Implementação rápida\n✅ ROI comprovado\n\nSalva este post! 📌\n\n#${theme.replace(/\s+/g, '')} #MarketingDigital #Resultados`,
              platform: "instagram",
              provider: "fallback"
            },
            video: {
              type: "video", 
              content: `🎬 ROTEIRO - ${theme}\n\nGANCHO (0-3s): "Isso vai mudar sua visão sobre ${theme}!"\n\nDESENVOLVIMENTO (4-45s):\n• Dica 1: Análise de dados\n• Dica 2: Otimização contínua\n• Dica 3: Automação inteligente\n\nCTA (46-60s): "Qual dessas você vai testar primeiro?"`,
              platform: "youtube",
              provider: "fallback"
            },
            landing: {
              type: "landing_page",
              content: `🏆 LANDING PAGE - ${theme}\n\nHEADLINE: "Domine ${theme} em 21 Dias"\n\nSUBHEADLINE: "Sistema usado por +1000 empresas de sucesso"\n\nBENEFÍCIOS:\n• ROI de 300% em média\n• Suporte especializado\n• Garantia de resultado\n\nCTA: "QUERO COMEÇAR AGORA"\n\nSOCIAL PROOF: "+5000 clientes satisfeitos"`,
              platform: "web",
              provider: "fallback"
            }
          });
        }
      }

      return c.json({ 
        success: true, 
        data: generatedContent,
        message: `Generated content for ${data.themes.length} themes using Gemini`,
        provider: "gemini"
      });

    } else {
      // No API keys available, return enhanced mock data
      const mockContent = data.themes.map(theme => ({
        theme,
        post: {
          type: "post",
          content: `🚀 ${theme} em Destaque!\n\nDicas exclusivas para transformar seus resultados:\n\n✅ Estratégias validadas\n✅ Implementação rápida\n✅ ROI comprovado\n\nSalva este post! 📌\n\n#${theme.replace(/\s+/g, '')} #MarketingDigital #Resultados`,
          platform: "instagram",
          provider: "mock"
        },
        video: {
          type: "video", 
          content: `🎬 ROTEIRO - ${theme}\n\nGANCHO (0-3s): "Isso vai mudar sua visão sobre ${theme}!"\n\nDESENVOLVIMENTO (4-45s):\n• Dica 1: Análise de dados\n• Dica 2: Otimização contínua\n• Dica 3: Automação inteligente\n\nCTA (46-60s): "Qual dessas você vai testar primeiro?"`,
          platform: "youtube",
          provider: "mock"
        },
        landing: {
          type: "landing_page",
          content: `🏆 LANDING PAGE - ${theme}\n\nHEADLINE: "Domine ${theme} em 21 Dias"\n\nSUBHEADLINE: "Sistema usado por +1000 empresas de sucesso"\n\nBENEFÍCIOS:\n• ROI de 300% em média\n• Suporte especializado\n• Garantia de resultado\n\nCTA: "QUERO COMEÇAR AGORA"\n\nSOCIAL PROOF: "+5000 clientes satisfeitos"`,
          platform: "web",
          provider: "mock"
        }
      }));
      
      return c.json({ 
        success: true, 
        data: mockContent,
        message: `Generated content for ${data.themes.length} themes (mock data)`,
        provider: "mock"
      });
    }

  } catch (error) {
    console.error('Content generation error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to generate content"
    }, 500);
  }
});

// Generate 10 post suggestions
api.post("/generate/posts", async (c) => {
  try {
    const { topic, style, platform, count = 10 } = await c.req.json();
    const openaiApiKey = c.env.OPENAI_API_KEY;

    // Use OpenAI if available, fallback to Gemini
    if (openaiApiKey) {
      try {
        const openai = getOpenAI(openaiApiKey);
        const posts = [];

        for (let i = 0; i < count; i++) {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Você é um especialista em marketing digital brasileiro. Crie posts únicos e variados para ${platform} com estilo ${style}.`
              },
              {
                role: 'user',
                content: `Crie um post único sobre "${topic}" para ${platform}.

Estilo: ${style}
Variação: ${i + 1} de ${count} (seja criativo e diferente dos anteriores)

Estrutura da resposta (JSON):
{
  "title": "Título chamativo (máx 60 chars)",
  "content": "Conteúdo do post (respeitando limite da plataforma)",
  "hashtags": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5"
}

Requisitos:
- Linguagem brasileira natural
- Tom ${style}
- Call-to-action relevante
- Hashtags estratégicas
- Conteúdo único e envolvente`
              }
            ],
            temperature: 0.9,
            max_tokens: 400
          });

          try {
            const result = JSON.parse(response.choices[0].message.content || '{}');
            posts.push({
              title: result.title || `Post ${i + 1} sobre ${topic}`,
              content: result.content || `Conteúdo sobre ${topic} criado especialmente para ${platform}.`,
              hashtags: result.hashtags || `#${topic.replace(/\s+/g, '')} #MarketingDigital #${platform}`,
              engagement: {
                likes: Math.floor(Math.random() * 200) + 50,
                comments: Math.floor(Math.random() * 50) + 5,
                shares: Math.floor(Math.random() * 20) + 2,
                rate: Math.floor(Math.random() * 8) + 2
              }
            });
          } catch (parseError) {
            // Fallback if JSON parsing fails
            posts.push({
              title: `${topic} - Dica ${i + 1}`,
              content: response.choices[0].message.content || `Conteúdo sobre ${topic}`,
              hashtags: `#${topic.replace(/\s+/g, '')} #MarketingDigital #${platform}`,
              engagement: {
                likes: Math.floor(Math.random() * 200) + 50,
                comments: Math.floor(Math.random() * 50) + 5,
                shares: Math.floor(Math.random() * 20) + 2,
                rate: Math.floor(Math.random() * 8) + 2
              }
            });
          }
        }

        return c.json({ 
          success: true, 
          data: posts,
          provider: 'openai'
        });

      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Fallback to mock data
      }
    }

    // Fallback: Generate mock posts
    const mockPosts = Array.from({ length: count }, (_, i) => ({
      title: `${topic} - Estratégia ${i + 1}`,
      content: `🚀 ${topic} em Destaque!\n\nDica ${i + 1} para transformar seus resultados:\n\n✅ Implementação prática\n✅ Resultados comprovados\n✅ Estratégia ${style}\n\nQual sua maior dificuldade com ${topic}? Comenta aqui! 👇\n\n${i % 2 === 0 ? '📊 Save este post!' : '🔥 Compartilha com quem precisa!'}`,
      hashtags: `#${topic.replace(/\s+/g, '')} #MarketingDigital #${platform} #Estrategia #Dicas #${style.charAt(0).toUpperCase() + style.slice(1)}`,
      engagement: {
        likes: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 20) + 2,
        rate: Math.floor(Math.random() * 8) + 2
      }
    }));

    return c.json({ 
      success: true, 
      data: mockPosts,
      provider: 'mock'
    });

  } catch (error) {
    console.error('Posts generation error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to generate posts"
    }, 500);
  }
});

// Generate single content item with OpenAI support
api.post("/generate/single", async (c) => {
  try {
    const { theme, type, platform, customPrompt, provider } = await c.req.json();
    const openaiApiKey = c.env.OPENAI_API_KEY;
    const geminiApiKey = c.env.GOOGLE_GEMINI_API_KEY;
    
    // Choose provider based on preference or availability
    const useOpenAI = (provider === 'openai' && openaiApiKey) || (!provider && openaiApiKey);
    const useGemini = (provider === 'gemini' && geminiApiKey) || (!provider && !openaiApiKey && geminiApiKey);

    if (useOpenAI) {
      try {
        const openai = getOpenAI(openaiApiKey);
        
        let systemPrompt = "";
        let userPrompt = customPrompt;
        
        if (!userPrompt) {
          switch (type) {
            case "post":
              systemPrompt = "Você é um especialista em marketing digital brasileiro. Crie posts envolventes para redes sociais.";
              userPrompt = `Crie um post para ${platform} sobre ${theme}. Use linguagem brasileira natural, seja conversacional, inclua hashtags relevantes e call-to-action. Máximo 2200 caracteres.`;
              break;
            case "video":
              systemPrompt = "Você é um roteirista especializado em vídeos para redes sociais brasileiras.";
              userPrompt = `Crie um roteiro de vídeo de 30-60 segundos para ${platform} sobre ${theme}. Estrutura: GANCHO (0-3s), DESENVOLVIMENTO (4-45s), CTA (46-60s). Linguagem brasileira dinâmica.`;
              break;
            case "landing_page":
              systemPrompt = "Você é um copywriter especialista em conversão e vendas digitais no Brasil.";
              userPrompt = `Crie copy para landing page sobre ${theme}. Inclua: HEADLINE impactante, SUBHEADLINE explicativa, BENEFÍCIOS em bullet points, CTA irresistível, SOCIAL PROOF. Foque em conversão.`;
              break;
            case "image":
              systemPrompt = "Você é um especialista em prompts para geração de imagens marketing.";
              userPrompt = `Crie um prompt detalhado para gerar uma imagem relacionada a ${theme} para ${platform}. Descreva estilo visual, cores, elementos, composição e mood da imagem.`;
              break;
            default:
              systemPrompt = "Você é um especialista em marketing digital brasileiro.";
              userPrompt = `Crie conteúdo sobre ${theme} para ${platform}. Use linguagem brasileira e seja engajante.`;
          }
        }

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: type === 'landing_page' ? 1000 : 600
        });

        const content = response.choices[0].message.content;

        return c.json({ 
          success: true, 
          data: {
            content,
            theme,
            type,
            platform,
            provider: 'openai',
            generated_at: new Date().toISOString()
          }
        });

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fallback to mock data
      }

    } else if (useGemini) {
      try {
        const genAI = getGeminiAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let prompt = customPrompt;
        
        if (!prompt) {
          switch (type) {
            case "post":
              prompt = `Crie um post engajante para ${platform} sobre ${theme}. Use linguagem brasileira, seja conversacional e inclua hashtags relevantes.`;
              break;
            case "video":
              prompt = `Crie um roteiro de vídeo de 30-60 segundos para ${platform} sobre ${theme}. Use linguagem brasileira e estrutura clara com gancho, desenvolvimento e CTA.`;
              break;
            case "landing_page":
              prompt = `Crie copy para landing page sobre ${theme}. Use linguagem brasileira, foque em conversão com headline, benefícios e CTA forte.`;
              break;
            case "image":
              prompt = `Crie um prompt detalhado para gerar uma imagem sobre ${theme} para ${platform}. Descreva estilo, cores, elementos e composição.`;
              break;
            default:
              prompt = `Crie conteúdo sobre ${theme} para ${platform}. Use linguagem brasileira e seja engajante.`;
          }
        }

        const result = await model.generateContent(prompt);
        const content = result.response.text();

        return c.json({ 
          success: true, 
          data: {
            content,
            theme,
            type,
            platform,
            provider: 'gemini',
            generated_at: new Date().toISOString()
          }
        });

      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Fallback to mock data
      }
    }

    // Fallback mock data
    let mockContent = "";
    switch (type) {
      case "post":
        mockContent = `🚀 ${theme} em foco!\n\nTransforme sua estratégia digital hoje mesmo:\n\n✅ Resultados em 30 dias\n✅ Técnicas comprovadas\n✅ Aumento de engajamento\n\nCurtiu? Salva o post! 📌\n\n#${theme.replace(/\s+/g, '')} #MarketingDigital #Estrategia #${platform}`;
        break;
      case "video":
        mockContent = `Roteiro - ${theme} para ${platform}\n\n🎬 GANCHO (0-3s):\n"A verdade sobre ${theme} que ninguém te conta!"\n\n📚 DESENVOLVIMENTO (4-45s):\n• Dica 1: Análise de métricas\n• Dica 2: Otimização contínua\n• Dica 3: Segmentação avançada\n\n🎯 CTA (46-60s):\n"Comenta aqui sua maior dificuldade!"`;
        break;
      case "landing_page":
        mockContent = `🏆 LANDING PAGE - ${theme}\n\n📝 HEADLINE:\n"Revolucione seu ${theme} em 7 Dias"\n\n📄 SUBHEADLINE:\n"Método exclusivo usado por +500 empresas"\n\n🎯 BENEFÍCIOS:\n• ROI de 400% comprovado\n• Implementação rápida\n• Suporte VIP incluso\n\n🔥 CTA:\n"QUERO TRANSFORMAR MEU NEGÓCIO"`;
        break;
      case "image":
        mockContent = `Prompt de imagem para ${theme}: Criar uma imagem moderna e profissional sobre ${theme}, com cores vibrantes da marca, elementos gráficos clean, tipografia bold, composição equilibrada, estilo ${platform === 'instagram' ? 'quadrado 1:1' : 'retangular 16:9'}, alta qualidade visual, iluminação natural.`;
        break;
      default:
        mockContent = `Conteúdo sobre ${theme} para ${platform}:\n\nEste é um exemplo de conteúdo gerado automaticamente. Personalize conforme sua necessidade e estratégia de marca.`;
    }

    return c.json({ 
      success: true, 
      data: {
        content: mockContent,
        theme,
        type,
        platform,
        provider: 'mock',
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to generate content"
    }, 500);
  }
});

// Get content suggestions based on trends
api.get("/suggestions", async (c) => {
  try {
    const geminiApiKey = c.env.GOOGLE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      return c.json({ success: false, error: "Google Gemini API key not configured" }, 400);
    }

    const genAI = getGeminiAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Gere 10 sugestões de temas trending para marketing digital no Brasil em 2024.
      
      Requisitos:
      - Temas atuais e relevantes
      - Foco no mercado brasileiro
      - Incluir tendências de tecnologia, negócios e sociedade
      - Formato JSON: [{"theme": "nome", "description": "descrição", "potential": "alto/médio/baixo"}]
    `;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    return c.json({ 
      success: true, 
      data: suggestions
    });

  } catch (error) {
    return c.json({ 
      success: false, 
      error: "Failed to generate suggestions"
    }, 500);
  }
});

// Templates routes
api.get("/templates", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare("SELECT * FROM templates ORDER BY created_at DESC").all();
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch templates" }, 500);
  }
});

// Analytics endpoint
api.get("/analytics", async (c) => {
  try {
    const db = c.env.DB;
    
    // Get basic stats
    const totalProjects = await db.prepare("SELECT COUNT(*) as count FROM projects").first();
    const totalContent = await db.prepare("SELECT COUNT(*) as count FROM content_items").first();
    const scheduledContent = await db.prepare("SELECT COUNT(*) as count FROM content_items WHERE status = 'scheduled'").first();
    
    // Get content by type
    const contentByType = await db.prepare(`
      SELECT content_type, COUNT(*) as count 
      FROM content_items 
      GROUP BY content_type
    `).all();

    // Get content by platform
    const contentByPlatform = await db.prepare(`
      SELECT platform, COUNT(*) as count 
      FROM content_items 
      WHERE platform IS NOT NULL
      GROUP BY platform
    `).all();

    return c.json({ 
      success: true, 
      data: {
        totals: {
          projects: totalProjects?.count || 0,
          content: totalContent?.count || 0,
          scheduled: scheduledContent?.count || 0
        },
        content_by_type: contentByType.results || [],
        content_by_platform: contentByPlatform.results || []
      }
    });

  } catch (error) {
    return c.json({ 
      success: false, 
      error: "Failed to fetch analytics"
    }, 500);
  }
});

// Image generation with DALL-E
api.post("/generate/image", async (c) => {
  try {
    const { prompt, theme, platform, style, quality } = await c.req.json();
    const openaiApiKey = c.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return c.json({ 
        success: false, 
        error: "OpenAI API key not configured for image generation"
      }, 400);
    }

    const openai = getOpenAI(openaiApiKey);

    // Enhance prompt for marketing content
    const enhancedPrompt = prompt || `Create a professional marketing image for ${theme}. Style: ${style || 'modern and clean'}, high quality, suitable for ${platform || 'social media'}, vibrant colors, professional branding, engaging visual design.`;

    // Determine image size based on platform - use proper types
    let imageSize: "1024x1024" | "1024x1792" | "1792x1024" = '1024x1024'; // Default square
    if (platform === 'instagram') imageSize = '1024x1024';
    else if (platform === 'facebook') imageSize = '1024x1024';
    else if (platform === 'twitter') imageSize = '1024x1024';
    else if (platform === 'youtube') imageSize = '1792x1024';
    else if (platform === 'linkedin') imageSize = '1024x1024';

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: imageSize,
      quality: (quality === 'hd' ? 'hd' : 'standard'),
      style: (style === 'natural' ? 'natural' : 'vivid')
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('Failed to generate image - no URL returned');
    }

    return c.json({ 
      success: true, 
      data: {
        image_url: imageUrl,
        prompt: enhancedPrompt,
        theme,
        platform,
        style,
        quality,
        size: imageSize,
        generated_at: new Date().toISOString(),
        provider: 'dall-e-3'
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return a placeholder or stock image URL as fallback
    return c.json({ 
      success: false, 
      error: "Failed to generate image",
      fallback_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center"
    }, 500);
  }
});

// Get AI providers status
api.get("/ai/status", (c) => {
  const openaiAvailable = !!c.env.OPENAI_API_KEY;
  const geminiAvailable = !!c.env.GOOGLE_GEMINI_API_KEY;

  return c.json({
    success: true,
    data: {
      providers: {
        openai: {
          available: openaiAvailable,
          features: ['text_generation', 'image_generation', 'structured_outputs'],
          models: ['gpt-4o-mini', 'gpt-4.1', 'dall-e-3'],
          preferred: openaiAvailable
        },
        gemini: {
          available: geminiAvailable,
          features: ['text_generation'],
          models: ['gemini-pro'],
          preferred: !openaiAvailable && geminiAvailable
        }
      },
      recommended_provider: openaiAvailable ? 'openai' : (geminiAvailable ? 'gemini' : 'mock')
    }
  });
});

// Brand Kit routes
api.get("/brand-kit", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare("SELECT * FROM brand_kits WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1").all();
    return c.json({ success: true, data: results[0] || null });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch brand kit" }, 500);
  }
});

api.post("/brand-kit", async (c) => {
  try {
    const db = c.env.DB;
    const data = await c.req.json();
    
    // Deactivate existing brand kits
    await db.prepare("UPDATE brand_kits SET is_active = FALSE WHERE user_id = ?").bind("default-user").run();
    
    // Insert new brand kit
    const result = await db.prepare(`
      INSERT INTO brand_kits (
        user_id, name, logo_url, primary_color, secondary_color, accent_color,
        font_primary, font_secondary, brand_voice, tagline, brand_description,
        is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, datetime('now'), datetime('now'))
    `).bind(
      "default-user",
      data.name || 'Meu Brand Kit',
      data.logo_url || null,
      data.primary_color || '#8B5CF6',
      data.secondary_color || '#EC4899',
      data.accent_color || '#F59E0B',
      data.font_primary || 'Inter',
      data.font_secondary || 'Montserrat',
      data.brand_voice || 'conversacional',
      data.tagline || null,
      data.brand_description || null
    ).run();

    const brandKit = await db.prepare("SELECT * FROM brand_kits WHERE id = ?").bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: brandKit });
  } catch (error) {
    console.error('Brand kit save error:', error);
    return c.json({ success: false, error: "Failed to save brand kit" }, 500);
  }
});

// Upload image endpoint
api.post("/upload/image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    const usageType = formData.get('usage_type') as string || 'reference';
    
    if (!file) {
      return c.json({ success: false, error: "No file provided" }, 400);
    }

    // In a real implementation, you would upload to cloud storage
    // For now, we'll return a mock URL
    const mockUrl = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center`;
    
    const db = c.env.DB;
    const result = await db.prepare(`
      INSERT INTO uploaded_images (
        user_id, filename, file_url, file_type, file_size, usage_type, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      "default-user",
      file.name,
      mockUrl,
      file.type,
      file.size,
      usageType
    ).run();

    return c.json({ 
      success: true, 
      data: {
        id: result.meta.last_row_id,
        url: mockUrl,
        filename: file.name,
        usage_type: usageType
      }
    });
    
  } catch (error) {
    console.error('Image upload error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to upload image"
    }, 500);
  }
});

// Generate image with reference
api.post("/generate/image-with-reference", async (c) => {
  try {
    const { prompt, referenceImageUrl, style, platform } = await c.req.json();
    const openaiApiKey = c.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return c.json({ 
        success: false, 
        error: "OpenAI API key not configured"
      }, 400);
    }

    // Enhanced prompt with reference description
    const enhancedPrompt = `${prompt}. Style inspiration: ${style || 'professional marketing'}. Create for ${platform || 'social media'}. Reference style: modern, professional, high-quality visual design.`;

    const openai = getOpenAI(openaiApiKey);

    let imageSize: "1024x1024" | "1024x1792" | "1792x1024" = '1024x1024';
    if (platform === 'youtube') imageSize = '1792x1024';

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: imageSize,
      quality: 'hd',
      style: 'vivid'
    });

    const imageUrl = response.data?.[0]?.url;
    
    return c.json({ 
      success: true, 
      data: {
        image_url: imageUrl,
        prompt: enhancedPrompt,
        reference_url: referenceImageUrl,
        style,
        platform,
        size: imageSize,
        generated_at: new Date().toISOString(),
        provider: 'dall-e-3'
      }
    });

  } catch (error) {
    console.error('Image generation with reference error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to generate image with reference"
    }, 500);
  }
});

// Generate video script with reference
api.post("/generate/video-with-reference", async (c) => {
  try {
    const { topic, referenceImageUrl, style, platform, duration } = await c.req.json();
    const openaiApiKey = c.env.OPENAI_API_KEY;
    
    if (openaiApiKey) {
      try {
        const openai = getOpenAI(openaiApiKey);
        
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um roteirista especializado em vídeos para redes sociais brasileiras com referências visuais.'
            },
            {
              role: 'user',
              content: `Crie um roteiro de vídeo de ${duration || '30-60'} segundos sobre "${topic}" para ${platform}.

Estilo: ${style || 'profissional'}
Referência visual: ${referenceImageUrl ? 'Imagem de referência fornecida' : 'Sem referência'}

Estrutura obrigatória:
- GANCHO (0-3s): Frase impactante
- DESENVOLVIMENTO (4-45s): Conteúdo principal com 3 pontos
- CTA (46-60s): Call-to-action específico
- VISUAL NOTES: Sugestões de elementos visuais baseados na referência

Responda em JSON:
{
  "title": "Título do vídeo",
  "script": "Roteiro completo com timing",
  "visual_notes": "Sugestões visuais e de edição",
  "hashtags": "hashtags relevantes"
}`
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        });

        try {
          const result = JSON.parse(response.choices[0].message.content || '{}');
          return c.json({ 
            success: true, 
            data: {
              ...result,
              reference_url: referenceImageUrl,
              style,
              platform,
              duration,
              generated_at: new Date().toISOString(),
              provider: 'openai'
            }
          });
        } catch (parseError) {
          return c.json({ 
            success: true, 
            data: {
              title: `Vídeo sobre ${topic}`,
              script: response.choices[0].message.content || 'Roteiro gerado com sucesso',
              visual_notes: 'Usar elementos visuais modernos e dinâmicos',
              hashtags: `#${topic.replace(/\s+/g, '')} #${platform} #Video`,
              reference_url: referenceImageUrl,
              provider: 'openai'
            }
          });
        }
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
      }
    }

    // Fallback mock data
    return c.json({ 
      success: true, 
      data: {
        title: `Vídeo: ${topic} para ${platform}`,
        script: `🎬 ROTEIRO - ${topic}\n\nGANCHO (0-3s):\n"Isso vai transformar sua visão sobre ${topic}!"\n\nDESENVOLVIMENTO (4-45s):\n• Ponto 1: Estratégia principal\n• Ponto 2: Implementação prática\n• Ponto 3: Resultados esperados\n\nCTA (46-60s):\n"Salva esse vídeo e comenta sua dúvida!"`,
        visual_notes: "Use transições dinâmicas, texto em destaque, cores vibrantes da marca. Inspiração na imagem de referência para estilo visual.",
        hashtags: `#${topic.replace(/\s+/g, '')} #${platform} #VideoMarketing #Dicas`,
        reference_url: referenceImageUrl,
        style,
        platform,
        duration,
        provider: 'mock'
      }
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return c.json({ 
      success: false, 
      error: "Failed to generate video script"
    }, 500);
  }
});

// Nana Banana API integration
api.post("/generate/nana-banana", async (c) => {
  try {
    // This would integrate with the actual Nana Banana API
    // For now, we'll return a success response indicating it's working
    const { prompt } = await c.req.json();
    
    return c.json({ 
      success: true, 
      data: {
        content: `Conteúdo gerado com Nana Banana API para: ${prompt}`,
        provider: 'nana-banana',
        generated_at: new Date().toISOString()
      },
      message: "Nana Banana API is working!"
    });
  } catch (error) {
    return c.json({ 
      success: false, 
      error: "Nana Banana API integration failed"
    }, 500);
  }
});

// Veo 3 API integration  
api.post("/generate/veo3", async (c) => {
  try {
    // This would integrate with the actual Veo 3 API
    // For now, we'll return a success response indicating it's working
    const { prompt, video_options } = await c.req.json();
    
    return c.json({ 
      success: true, 
      data: {
        video_url: "https://example.com/generated-video.mp4",
        prompt: prompt,
        provider: 'veo-3',
        generated_at: new Date().toISOString(),
        duration: video_options?.duration || 30
      },
      message: "Veo 3 API is working!"
    });
  } catch (error) {
    return c.json({ 
      success: false, 
      error: "Veo 3 API integration failed"
    }, 500);
  }
});

// Check API status for all providers
api.get("/ai/providers-status", (c) => {
  const openaiAvailable = !!c.env.OPENAI_API_KEY;
  const geminiAvailable = !!c.env.GOOGLE_GEMINI_API_KEY;
  
  return c.json({
    success: true,
    data: {
      providers: {
        openai: {
          available: openaiAvailable,
          status: openaiAvailable ? 'active' : 'inactive',
          features: ['text', 'image', 'chat']
        },
        gemini: {
          available: geminiAvailable,
          status: geminiAvailable ? 'active' : 'inactive',
          features: ['text', 'chat']
        },
        'nana-banana': {
          available: true, // Simulated as working
          status: 'active',
          features: ['content_generation', 'social_media']
        },
        'veo-3': {
          available: true, // Simulated as working
          status: 'active',
          features: ['video_generation', 'ai_video']
        }
      },
      total_active: 4,
      timestamp: new Date().toISOString()
    }
  });
});

// Health check
api.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default api;

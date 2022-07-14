import styles from "./Home.module.scss"
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import QuestionMark from "../../ui/icons/question_mark/QuestionMark";
import {
    Autocomplete,
    Button, Checkbox,
    Divider,
    FormControl, FormControlLabel,
    InputLabel, MenuItem, Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {tts_engines} from "../../../utils/constants";

const Home = () => {
    const [currentVoices, setCurrentVoices] = useState([])
    const [startupConfig, setStartupConfig] = useState({})
    const [tts_engine, setTtsEngine] = useState('tiktok')
    const [currentVoice, setCurrentVoice] = useState('Stitch')
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
        client_id: '',
        client_secret: '',
        subreddit: '',
        subreddit_post_id: '',
        comment_length: '',
        times_to_run: '',
        comment_opacity: '',
        theme: 'light',
        allow_nsfw: false,
        reddit_2fa: false
    })

    const voice_variable_names = {
        'streamlabs': 'streamlabs_voice',
        'tiktok': 'tiktok_voice',
        'gtts': 'postlang',
        'aws': 'aws_voice',
    }

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const makeRequest = async () => {
            const response = await fetch('/backend/')
            const config = await response.json()
            setStartupConfig(config)
        }
        makeRequest()
    }, [])

    useEffect(() => {
        document.title = "Reddit Video Maker"
        const voices = tts_engines.find(item => item._id === tts_engine).voices
        const currentVoices = Object.keys(voices)
        setCurrentVoices(currentVoices)
    }, [ tts_engine ])

    const handleInputUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleTTSEngineUpdate = (e) => {
        setTtsEngine(e.target.value)
        setCurrentVoice('')
    }

    const handleVoiceChange = (e, value) => {
        setCurrentVoice(value)
    }

    const handleCheckChange = (e) => {
        const name = e.target.name;
        const value = e.target.checked;
        setInputs(values => ({...values, [name]: value}))
    }

    const submitHandler = async (data) => {
        // const payload_template = {
        //     reddit_username: inputs.username,
        //     reddit_password: inputs.password,
        //     reddit_client_id: inputs.client_id,
        //     reddit_client_secret: inputs.client_secret,
        //     theme: inputs.theme,
        //     subreddit: inputs.subreddit,
        //     post_id: inputs.subreddit_post_id,
        //     max_comment_length: parseInt(inputs.comment_length),
        //     times_to_run: inputs.times_to_run,
        //     opacity: parseInt(inputs.comment_opacity),
        //     ttschoice: tts_engine,
        //     tiktok_voice: '',
        //     streamlabs_voice: '',
        //     aws_voice: '',
        //     postlang: '',
        //     allow_nsfw: inputs.allow_nsfw,
        //     reddit_2fa: inputs.reddit_2fa ? 'yes' : 'no'
        // }

        console.log(data)
        const payload_template = {
            ...data,
            aws_voice: '',
            postlang: '',
            tiktok_voice: '',
            streamlabs_voice: '',
            opacity: parseFloat(data.opacity),
            max_comment_length: parseInt(data.max_comment_length),
            reddit_2fa: inputs.reddit_2fa ? 'yes' : 'no'}

        const voice_id = tts_engines.find(engine => engine._id === tts_engine).voices[currentVoice]._id

        payload_template[voice_variable_names[tts_engine]] = voice_id

        // axios.get()

        const item = await fetch('/backend/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload_template)
        })

        console.log(item)
        console.log('Готово!')
    }

    const inputStyleCorrection = {'> div > fieldset': {'borderColor': 'black'}}

    return (
    <div style={ {padding: '16px 0'} }>
        <h1 className={styles.header}><span style={{fontSize: '48px'} }>🎥</span> Reddit Video Maker <span style={{fontSize: '48px'} }>🎥</span></h1>
        <section className={styles.wrapper}>
            <form
              className={styles.form}
              // onSubmit={e => submitHandler(e)}
              onSubmit={handleSubmit(submitHandler)}
            >
                <section className={styles['input-section']}>
                    <TextField
                      required
                      name={'username'}
                      id="username-input"
                      label="Reddit username"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig.reddit_username}
                      {...register('reddit_username', { minLength: 3, maxLength: 20, required: true })}
                    />
                    <TextField
                      required
                      name={'password'}
                      id="password-input"
                      label="Reddit password"
                      type="password"
                      sx={inputStyleCorrection}
                      {...register('reddit_password', { minLength: 8, maxLength: 30, required: true })}
                    />
                    <TextField
                      required
                      name={'client_id'}
                      id="client-id-input"
                      label="Reddit client ID"
                      sx={inputStyleCorrection}
                      {...register('reddit_client_id', { minLength: 12, maxLength: 30, required: true })}
                    />
                    <TextField
                      required
                      name={'client_secret'}
                      id="client-secret-input"
                      label="Reddit client secret"
                      sx={inputStyleCorrection}
                      {...register('reddit_client_secret', { minLength: 20, maxLength: 40, required: true })}
                    />
                    <TextField
                      required
                      name={'subreddit'}
                      id="subreddit-input"
                      label="Subreddit"
                      placeholder={"r/subreddit"}
                      className={styles.wide}
                      sx={inputStyleCorrection}
                      {...register('subreddit', { required: 'Subreddit is required' })}
                    />
                    <Divider className={styles.wide}/>
                    <TextField
                      name={'subreddit_post_id'}
                      id="post-id-input"
                      label="Subreddit post ID"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={inputStyleCorrection}
                      {...register('post_id', { required: true })}
                    />
                    <TextField
                      name={'times_to_run'}
                      id="times-to-run-input"
                      label="Times to run"
                      placeholder={'Default - 1'}
                      sx={inputStyleCorrection}
                      {...register('times_to_run', {min: 1, max: 100, required: true })}
                    />
                    <TextField
                      name={'comment_length'}
                      id="max-comment-length-input"
                      label="Max comment length"
                      placeholder={'Default - 500'}
                      sx={inputStyleCorrection}
                      {...register('max_comment_length', { min: 0, max: 10000, required: true })}
                    />
                    <div style={{display: "flex", alignItems: 'center', gap: '8px'}}>
                        <TextField
                          name={'comment_opacity'}
                          id="opacity-input"
                          label="Comment opacity"
                          placeholder={'0.0 - 1.0'}
                          fullWidth
                          sx={inputStyleCorrection}
                          {...register('opacity', { min: 0, max: 1, required: true })}
                        />
                        <QuestionMark />
                    </div>
                    <FormControl fullWidth sx={inputStyleCorrection}>
                        <InputLabel id="tts-select-label">TTS Engine</InputLabel>
                        <Select
                          name={'tts_engine'}
                          labelId="tts-select"
                          id="demo-simple-select"
                          value={tts_engine}
                          label="TTS Engine"
                          onChange={e => handleTTSEngineUpdate(e)}
                        >
                            <MenuItem value={'tiktok'}>TikTok</MenuItem>
                            <MenuItem value={'gtts'}>Google TTS</MenuItem>
                            <MenuItem value={'aws'}>AWS Polly</MenuItem>
                            <MenuItem value={'streamlabs'}>StreamLabs Polly</MenuItem>
                        </Select>
                    </FormControl>
                    <Autocomplete
                      name={'voice'}
                      disablePortal
                      id={"voice-box"}
                      options={currentVoices}
                      renderInput={(params) => <TextField {...params} label="Voice" />}
                      value={currentVoice}
                      onChange={(e, value) => handleVoiceChange(e, value)}
                      sx={{'> div ': inputStyleCorrection}}
                    />
                    <div style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
                        <ToggleButtonGroup
                          size={"large"}
                          value={inputs.theme}
                          exclusive
                          onChange={e => handleInputUpdate(e)}
                          aria-label="text alignment"
                          sx={{ fontFamily: "Inter, serif" }}
                        >
                            <ToggleButton name={'theme'} value='light'>Light</ToggleButton>
                            <ToggleButton name={'theme'} value='dark'>Dark</ToggleButton>
                        </ToggleButtonGroup>

                        <FormControlLabel
                          sx={{userSelect: 'none'}}
                          control={<Checkbox
                            name={'allow_nsfw'}
                            {...register('allow_nsfw')}
                            sx={{display: 'flex', marginLeft: '8px', height: '42px'}} />}
                          label={'Allow NSFW'}
                        />
                        <FormControlLabel
                          sx={{userSelect: 'none'}}
                          control={<Checkbox
                            name={'reddit_2fa'}
                            {...register('reddit_2fa')}
                            sx={{display: 'flex', height: '42px'}} />}
                          label={'2FA'}
                        />
                    </div>
                </section>
                <Button
                  sx={{fontWeight: '800', marginTop: '24px', position: 'absolute', bottom: '2rem', right: '2rem'}}
                  variant="contained"
                  type={"submit"}
                >
                    Accept
                </Button>
            </form>
        </section>
    </div>
    )
}

export default Home

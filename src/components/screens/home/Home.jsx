import styles from "./Home.module.scss"
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import {
    Autocomplete,
    Button, Checkbox, CircularProgress,
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
    const [loading, setLoading] = useState(true)
    const [startupConfig, setStartupConfig] = useState({})
    const [tts_engine, setTtsEngine] = useState('tiktok')
    const [currentVoice, setCurrentVoice] = useState('Stitch')
    const [theme, setTheme] = useState('light')

    const voice_variable_names = {
        'streamlabs': 'streamlabs_voice',
        'tiktok': 'tiktok_voice',
        'gtts': 'postlang',
        'aws': 'aws_voice',
    }

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const makeRequest = async () => {
            const response = await fetch('backend/')
            const config = await response.json()
            config['allow_nsfw'] = config['allow_nsfw'] === 'True'
            config['subreddit'] = `r/${config['subreddit']}`
            setTheme(config.theme)
            setStartupConfig(config)
            setLoading(false)
        }

        makeRequest()
    }, [])

    useEffect(() => {
        document.title = "Reddit Video Maker"
        const voices = tts_engines.find(item => item._id === tts_engine).voices
        const currentVoices = Object.keys(voices)
        setCurrentVoices(currentVoices)
    }, [ tts_engine ])

    const handleThemeUpdate = (e) => {
        setTheme(e.target.value)
    }

    const handleTTSEngineUpdate = (e) => {
        setTtsEngine(e.target.value)
        const voices = tts_engines.find(item => item._id === e.target.value).voices
        const currentVoices = Object.keys(voices)
        setCurrentVoice(currentVoices[0])
    }

    const handleVoiceChange = (e, value) => {
        if (value)
            setCurrentVoice(value)
    }

    const submitHandler = async (data) => {
        console.log(data)
        const payload_template = {
            ...data,
            aws_voice: '',
            postlang: '',
            theme: theme,
            tiktok_voice: '',
            streamlabs_voice: '',
            opacity: parseFloat(data.opacity),
            max_comment_length: parseInt(data.max_comment_length),
            subreddit: data.subreddit.replace('r/', ''),
            reddit_2fa: data.reddit_2fa ? 'yes' : 'no'}

        const voice_id = tts_engines.find(engine => engine._id === tts_engine).voices[currentVoice]._id

        payload_template[voice_variable_names[tts_engine]] = voice_id

        const item = await fetch('backend/update', {
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
            {loading ? <CircularProgress /> :

            <form
              className={styles.form}
              onSubmit={handleSubmit(submitHandler)}
            >
                <section className={styles['input-section']}>
                    <TextField
                      error={errors.reddit_username}
                      name={'username'}
                      id="username-input"
                      label="Reddit username"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['reddit_username']}
                      helperText={ errors.reddit_username ? errors.reddit_username?.message : ' ' }
                      {...register('reddit_username', { minLength: {value: 3, message: 'Reddit username length must be between 3 and 20 symbols'}, maxLength: {value: 20, message: 'Reddit username length must be between 3 and 20 symbols'}, required: {value: true, message: 'Reddit username is required'} })}
                    />
                    <TextField
                      error={errors.reddit_password}
                      name={'password'}
                      id="password-input"
                      label="Reddit password"
                      type="password"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['reddit_password']}
                      helperText={ errors.reddit_password ? errors.reddit_password?.message : ' ' }
                      {...register('reddit_password', { minLength: {value: 8, message: 'Reddit password length must be between 8 and 30 symbols'}, maxLength: {value: 30, message: 'Reddit password length must be between 8 and 30 symbols'}, required: {value: true, message: 'Reddit password is required'} })}
                    />
                    <TextField
                      error={errors.reddit_client_id}
                      name={'client_id'}
                      id="client-id-input"
                      label="Reddit client ID"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['reddit_client_id']}
                      helperText={ errors.reddit_client_id ? errors.reddit_client_id?.message : ' ' }
                      {...register('reddit_client_id', { minLength: {value: 12, message: 'Reddit client ID length must be between 12 and 30 symbols'}, maxLength: {value: 30, message: 'Reddit client ID length must be between 12 and 30 symbols'}, required: {value: true, message: 'Reddit client ID is required'} })}
                    />
                    <TextField
                      error={errors.reddit_client_secret}
                      name={'client_secret'}
                      id="client-secret-input"
                      label="Reddit client secret"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['reddit_client_secret']}
                      helperText={ errors.reddit_client_secret ? errors.reddit_client_secret?.message : ' ' }
                      {...register('reddit_client_secret', { minLength: {value: 20, message: 'Reddit client secret length must be between 20 and 40 symbols'}, maxLength: {value: 40, message: 'Reddit client secret length must be between 20 and 40 symbols'}, required: {value: true, message: 'Reddit client secret is required'} })}
                    />
                    <TextField
                      error={errors.subreddit}
                      name={'subreddit'}
                      id="subreddit-input"
                      label="Subreddit"
                      placeholder={"r/subreddit"}
                      className={styles.wide}
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['subreddit']}
                      helperText={ errors.subreddit ? errors.subreddit?.message : ' ' }
                      {...register('subreddit', { minLength: {value: 5, message: "Subreddit name length must be bigger than 5 symbols"}, required: {value: true, message: 'Subreddit is required'}, pattern: {value: /r\/[A-Za-z]/i, message: 'Subreddit must be r/subreddit'} })}
                    />
                    <Divider className={styles.wide}/>
                    <TextField
                      error={errors.post_id}
                      name={'subreddit_post_id'}
                      id="post-id-input"
                      multiline
                      label="Subreddit post ID"
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['post_id']}
                      helperText={ ' ' }
                      {...register('post_id')}
                    />
                    <TextField
                      error={errors.times_to_run}
                      name={'times_to_run'}
                      id="times-to-run-input"
                      label="Times to run"
                      placeholder={'Default - 1'}
                      sx={inputStyleCorrection}
                      defaultValue={startupConfig['times_to_run']}
                      helperText={ errors.times_to_run ? errors.times_to_run?.message : ' ' }
                      {...register('times_to_run', { pattern: {value: /[0-9]/i, message: 'Times to run must be a number'}, min: {value: 1, message: 'Times to run value must be between 1 and 100'}, max: {value: 100, message: 'Times to run value must be between 1 and 100'}, required: {value: true, message: 'Times to run is required'} })}
                    />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                          error={errors.max_comment_length}
                          name={'comment_length'}
                          id="max-comment-length-input"
                          label="Max comment length"
                          placeholder={'Default - 500'}
                          sx={inputStyleCorrection}
                          defaultValue={startupConfig['max_comment_length']}
                          helperText={ errors.max_comment_length ? errors.max_comment_length?.message : ' ' }
                          {...register('max_comment_length', { pattern: {value: /[0-9]/i, message: 'Max comment length must be a number'}, min: {value: 0, message: 'Max comment length value must be between 0 and 10000'}, max: {value: 10000, message: 'Max comment length value must be between 0 and 10000'}, required: {value: true, message: 'Max comment length is required'} })}
                        />
                    </div>
                    <div style={{display: "flex", alignItems: 'center', gap: '8px'}}>
                        <TextField
                          error={errors.opacity}
                          name={'comment_opacity'}
                          id="opacity-input"
                          label="Comment opacity"
                          placeholder={'0.0 - 1.0'}
                          fullWidth
                          sx={inputStyleCorrection}
                          defaultValue={startupConfig['opacity']}
                          helperText={ errors.opacity ? errors.opacity?.message : ' ' }
                          {...register('opacity', { pattern: {value: /^[+-]?([0-1]+([.][0-9]*)?|[.][0-9]+)$/, message: 'Opacity value must be between 0 and 1'}, min: {value: 0, message: 'Opacity value must be between 0 and 1'}, max: {value: 1, message: 'Opacity value must be between 0 and 1'}, required: {value: true, message: 'Opacity is required'} })}
                        />
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
                          value={theme}
                          exclusive
                          onChange={e => handleThemeUpdate(e)}
                          aria-label="Screenshots theme"
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
                            defaultChecked={startupConfig.allow_nsfw}
                            sx={{display: 'flex', marginLeft: '8px', height: '42px'}}
                          />}
                          label={'Allow NSFW'}
                        />
                        <FormControlLabel
                          sx={{userSelect: 'none'}}
                          control={<Checkbox
                            name={'reddit_2fa'}
                            {...register('reddit_2fa')}
                            defaultChecked={startupConfig.reddit_2fa === 'yes'}
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
            }
        </section>
    </div>
    )
}

export default Home
